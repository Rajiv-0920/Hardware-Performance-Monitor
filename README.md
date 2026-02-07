# Hardware Performance Monitor

Hardware Performance Monitor is a real-time system monitoring tool that streams hardware metrics (CPU, Memory, Disk, Network) to a web frontend using WebSockets.


## Screenshots

![Dashboard screenshot](docs/screenshot.png)

## Demo video

![Live demo](docs/demo.gif)

## Overview

Hardware Performance Monitor is a lightweight real-time monitoring service that collects system metrics and streams them to a client application using Socket.io. The backend periodically polls system metrics and emits them over WebSocket channels so a frontend can render live charts and tables.

Key metrics include:
- CPU usage and temperature
- Memory usage
- Disk layout, block devices, filesystem sizes and stats
- Disk I/O
- Network upload/download rates

## Tech Stack

- Node.js
- Express
- Socket.io
- systeminformation (implied dependency used for collecting hardware metrics)
- dotenv for environment config

## Features

- Real-time streaming of hardware metrics via WebSockets
- Modular metric emission so the frontend can subscribe to specific channels
- Single, centralized polling loop (1-second interval) to reduce overhead

Exposed socket events (emitted from the server):

- `cpu_update`
- `memory_update`
- `disk_layout_update`
- `block_devices_update`
- `fs_size_update`
- `fs_state_update`
- `disk_io_update`
- `network_update`

These events match the server's per-second emissions and can be directly consumed by client-side Socket.io listeners.

## Architecture

The server creates a single Socket.io connection per client and runs a centralized polling interval (1 second) that gathers system metrics (via `systeminformation` or similar) and emits them across multiple socket channels. This approach keeps collection logic centralized and minimizes duplicated system calls while providing a high-frequency live data stream to any connected client.

Flow summary:

1. Client connects to the server via Socket.io.
2. Server starts a per-client interval (1s) that calls the system metrics service.
3. Server emits metric-specific events (e.g. `cpu_update`) with the latest data.
4. Client receives events and updates UI components (charts, tables, stats) in real-time.

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- On macOS/Linux: permissions to query system metrics (some metrics may require elevated privileges)

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd hardware_performance_monitor
```

2. Install server dependencies:

```bash
cd server
npm install
```

3. (Optional) Install client dependencies and run frontend dev server:

```bash
cd ../client
npm install
```

4. Create a `.env` file in the `server` folder or set environment variables as needed.

Recommended environment variables:

- `PORT` — Port for the server (default: `5000`).
- `CLIENT_URL` — Origin allowed for CORS (default: `http://localhost:5173`).
- `NODE_ENV` — `development` or `production`.

Example `.env`:

```
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Usage

Development (server):

```bash
cd server
npm run dev
```

Development (client - separate terminal):

```bash
cd client
npm run dev
```

## Environment & Deployment Tips

- Use a process manager (PM2, systemd) for production to restart on crash and manage logs.
- For remote deployments, set `CLIENT_URL` to the actual client origin to enable CORS only for that origin.
- Monitor resource usage of the monitor itself; the 1s polling interval balances responsiveness with overhead—adjust as needed.

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and follow standard GitHub flow with feature branches and pull requests.

## License

Specify a license for this project (e.g., MIT). Add a `LICENSE` file in the repository.


Thanks — happy monitoring!
