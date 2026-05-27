// server.js
const { executeCode } = require('./runner');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

// Configure dynamic CORS gatekeeping rules
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

const server = http.createServer(app);

// Initialize Socket.io with strict cross-origin security gateways
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Centralized In-Memory Cache for Active Collaborative Workspaces
// Key: roomId -> Value: { code, language, users: [ { socketId, username } ] }
const activeRooms = new Map();

// Establish connection parameters to your shared MongoDB Atlas cluster
let db;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDatabase() {
  try {
    await client.connect();
    db = client.db('linkide_db');
    console.log('⚡ [Database]: Secure MongoDB Cluster Linked seamlessly.');
  } catch (err) {
    console.error('❌ [Database Failure]: Could not open structural cluster links:', err);
  }
}
connectDatabase();

// --- SOCKET.IO REAL-TIME COLLABORATION ROUTING ---
io.on('connection', (socket) => {
  console.log(`🔌 [Socket Connected]: Handle channel active for ID: ${socket.id}`);

  // 1. User requests entry into an active programming workspace room
  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId);

    // Attach tracking parameters onto the atomic socket session instance itself
    socket.roomId = roomId;

    // If the room doesn't exist in our memory map, initialize it from DB or scratch
    if (!activeRooms.has(roomId)) {
      // Try to restore an existing workspace buffer state from MongoDB backup records
      const savedRoom = await db?.collection('rooms').findOne({ roomId });
      
      activeRooms.set(roomId, {
        code: savedRoom?.code || '// Start writing real-time code loops here...\n',
        language: savedRoom?.language || 'javascript',
        users: []
      });
    }

    const roomState = activeRooms.get(roomId);
    
    // Track user identity details within the room footprint list
    roomState.users.push({ socketId: socket.id, username });
    console.log(`👤 [User Joined]: "${username}" entered workspace room [${roomId}]`);

    // Synchronize the joining client with the existing live workspace text buffer immediately
    socket.emit('sync-initial-state', {
      code: roomState.code,
      language: roomState.language
    });

    // Notify all other developers inside the room to update their presence counters
    io.to(roomId).emit('room-presence-update', { count: roomState.users.length });
  });

  // 2. Real-Time Code Input Interceptor (Triggers on character strokes)
  socket.on('code-change', ({ roomId, code }) => {
    const roomState = activeRooms.get(roomId);
    if (roomState) {
      roomState.code = code; // Update the in-memory master state copy
      
      // Broadcast the exact text diff string out to all other connected peers in the space
      socket.to(roomId).emit('code-update', code);
    }
  });

  // 2.5 Real-Time Interactive Cursor Pointer Forwarder
  socket.on('cursor-move', ({ roomId, position }) => {
    const roomState = activeRooms.get(roomId);
    if (roomState) {
      // Identify who is broadcast-moving based on their socket channel fingerprint ID
      const user = roomState.users.find(u => u.socketId === socket.id);
      const username = user ? user.username : "Peer Developer";
      
      // Dispatch cursor coordinate mappings to everyone else inside the workspace loop
      socket.to(roomId).emit('cursor-update', { username, position });
    }
  });

  // 3. Real-Time Chat Message Forwarder Middleware Pipeline
  socket.on('send-message', ({ roomId, messageData }) => {
    // Broadcast the message object payload to everyone else sitting inside the room array
    socket.to(roomId).emit('receive-message', messageData);
  });

  // 4. Client Connection Termination Cleanups
  socket.on('disconnect', async () => {
    console.log(`❌ [Socket Disconnected]: Signal lost for ID: ${socket.id}`);
    
    for (const [roomId, roomState] of activeRooms.entries()) {
      const userIndex = roomState.users.findIndex(u => u.socketId === socket.id);
      
      if (userIndex !== -1) {
        // Drop the user out of the tracking list array
        const [removedUser] = roomState.users.splice(userIndex, 1);
        console.log(`🏃 [User Left]: "${removedUser.username}" exited workspace context space.`);

        // If people are still working in the room, update their UI counters
        if (roomState.users.length > 0) {
          io.to(roomId).emit('room-presence-update', { count: roomState.users.length });
        } else {
          // 💾 EMPTY ROOM CLEANUP LOOP: Flush final code buffer to MongoDB before clearing memory
          try {
            await db?.collection('rooms').updateOne(
              { roomId },
              { $set: { code: roomState.code, language: roomState.language, updatedAt: new Date() } },
              { upsert: true }
            );
            console.log(`💾 [Auto-Save]: Room [${roomId}] empty. Finalized states written safely to Atlas.`);
          } catch (dbErr) {
            console.error(`❌ [Auto-Save Failure] for Room [${roomId}]:`, dbErr);
          }
          
          activeRooms.delete(roomId); // Wipe the room from active RAM cache allocation
        }
        break;
      }
    }
  });
});

// --- CODE EXECUTION SECURE REST API ENDPOINT ---
app.post('/api/compile', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language definition footprints.' });
  }

  try {
    // Pipe code directly into our custom isolated multi-language Docker runner engine
    const result = await executeCode(code, language);
    return res.json(result);
  } catch (err) {
    console.error('❌ [Execution Service Error]:', err);
    return res.status(500).json({ error: 'Orchestration server collapsed processing execution runtime loops.' });
  }
});

// --- CORE APPLICATION LISTEN ENGINE ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 [LinkIDE Multi-Server Engine Running]: Listening safely on port *:${PORT}`);
});