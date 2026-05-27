// runner.js
const Docker = require('dockerode');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const docker = new Docker(); // Connects to local docker daemon

// The Master Configuration Matrix for 16 Languages
const RUNTIME_CONFIGS = {
  // --- PREVIOUS LANGUAGES ---
  javascript: {
    image: 'node:18-alpine',
    fileName: 'index.js',
    command: (file) => ['node', `/sandbox/${file}`]
  },
  python: {
    image: 'python:3.10-alpine',
    fileName: 'script.py',
    command: (file) => ['python', `/sandbox/${file}`]
  },
  c: {
    image: 'frolvlad/alpine-gxx:latest',
    fileName: 'main.c',
    command: (file) => ['sh', '-c', `gcc -O3 /sandbox/${file} -o /sandbox/app && /sandbox/app`]
  },
  cpp: {
    image: 'frolvlad/alpine-gxx:latest',
    fileName: 'main.cpp',
    command: (file) => ['sh', '-c', `g++ -O3 /sandbox/${file} -o /sandbox/app && /sandbox/app`]
  },
  java: {
    image: 'openjdk:17-alpine',
    fileName: 'Main.java',
    command: (file) => ['sh', '-c', `javac /sandbox/${file} && java -cp /sandbox Main`]
  },
  go: {
    image: 'golang:1.21-alpine',
    fileName: 'main.go',
    command: (file) => ['sh', '-c', `go run /sandbox/${file}`]
  },
  ruby: {
    image: 'ruby:3.2-alpine',
    fileName: 'script.rb',
    command: (file) => ['ruby', `/sandbox/${file}`]
  },

  // --- NEWLY ADDED LANGUAGES ---
  typescript: {
    image: 'node:18-alpine',
    fileName: 'main.ts',
    // Uses npx ts-node to execute TypeScript on the fly without manual build steps
    command: (file) => ['sh', '-c', `npx -y ts-node /sandbox/${file}`]
  },
  rust: {
    image: 'rust:1.75-alpine',
    fileName: 'main.rs',
    command: (file) => ['sh', '-c', `rustc /sandbox/${file} -o /sandbox/app && /sandbox/app`]
  },
  csharp: {
    image: 'mcr.microsoft.com/dotnet/sdk:8.0-alpine',
    fileName: 'Program.cs',
    // Creates a lightweight inline script wrapper context for rapid execution
    command: (file) => ['sh', '-c', `dotnet new script -o /sandbox/scr --force && cp /sandbox/${file} /sandbox/scr/Program.cs && dotnet run --project /sandbox/scr`]
  },
  swift: {
    image: 'swift:5.9-alpine',
    fileName: 'main.swift',
    command: (file) => ['swift', `/sandbox/${file}`]
  },
  kotlin: {
    image: 'zenika/kotlin-alpine:latest',
    fileName: 'main.kt',
    command: (file) => ['sh', '-c', `kotlinc /sandbox/${file} -include-runtime -d /sandbox/app.jar && java -jar /sandbox/app.jar`]
  },
  dart: {
    image: 'dart:stable',
    fileName: 'main.dart',
    command: (file) => ['dart', 'run', `/sandbox/${file}`]
  },
  r: {
    image: 'r-base:latest',
    fileName: 'script.R',
    command: (file) => ['Rscript', `/sandbox/${file}`]
  },
  php: {
    image: 'php:8.2-alpine',
    fileName: 'index.php',
    command: (file) => ['php', `/sandbox/${file}`]
  },
  sql: {
    image: 'keinos/sqlite3:latest',
    fileName: 'query.sql',
    // Pipes the user queries straight into a temporary in-memory SQLite sandbox database
    command: (file) => ['sh', '-c', `sqlite3 < /sandbox/${file}`]
  }
};

async function executeCode(code, language) {
  if (language === 'html' || language === 'css') {
    return { 
      success: true, 
      output: 'ℹ️ [DevSync Web View]: HTML/CSS runs natively on the client interface.' 
    };
  }

  const config = RUNTIME_CONFIGS[language];
  if (!config) {
    return { success: false, output: `Unsupported language selection: ${language}` };
  }

  const executionId = uuidv4();
  const tmpDir = path.join(__dirname, 'tmp', executionId);
  const filePath = path.join(tmpDir, config.fileName);

  try {
    await fs.ensureDir(tmpDir);
    await fs.writeFile(filePath, code);

    const container = await docker.createContainer({
      Image: config.image,
      Cmd: config.command(config.fileName),
      NetworkDisabled: true, // Air-gaps container for deep isolation security
      HostConfig: {
        Binds: [`${tmpDir}:/sandbox`],
        Memory: 256 * 1024 * 1024, // Bumped to 256MB to comfortably support heavier runtimes like C# / Kotlin
        NanoCpus: 1000000000 // Boosted resource execution headroom to 1 full CPU core
      },
      Tty: false,
      AttachStdout: true,
      AttachStderr: true
    });

    await container.start();

    // 7-second execution watchdog trap (Gives compilers slightly more time to optimize structures)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 7000)
    );

    const executionPromise = container.wait();

    try {
      await Promise.race([executionPromise, timeoutPromise]);
    } catch (err) {
      if (err.message === 'TIMEOUT') {
        await container.kill().catch(() => {});
        await container.remove().catch(() => {});
        await fs.remove(tmpDir).catch(() => {});
        return { success: false, output: '💀 Process Terminated: Execution Timeout Exceeded (7s Loop Guard Triggered).' };
      }
      throw err;
    }

    const logsBuffer = await container.logs({ stdout: true, stderr: true });
    let output = logsBuffer.toString('utf8').replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();

    await container.remove().catch(() => {});
    await fs.remove(tmpDir).catch(() => {});

    return { 
      success: true, 
      output: output || 'Process finished successfully with no output logs returned.' 
    };

  } catch (error) {
    await fs.remove(tmpDir).catch(() => {});
    return { success: false, output: `System Code Sandbox Exception: ${error.message}` };
  }
}

module.exports = { executeCode };