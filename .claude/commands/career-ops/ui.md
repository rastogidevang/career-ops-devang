Start the career-ops web UI dashboard.

Run this command from the terminal and open the browser:

```bash
bash web-ui/bin/start.sh
```

This will:
1. Install web-ui dependencies if missing (one-time)
2. Start the Express server on http://127.0.0.1:4317
3. Open the browser automatically

To stop the server, press Ctrl-C in the terminal where it's running.

**Options:**
- Different port: `PORT=8080 bash web-ui/bin/start.sh`
- Watch mode (auto-restart on code changes): `cd web-ui && npm run dev`
- Expose on LAN: `HOST=0.0.0.0 bash web-ui/bin/start.sh`
