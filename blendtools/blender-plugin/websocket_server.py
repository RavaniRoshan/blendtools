
import asyncio
import threading
import websockets
import logging
from . import command_handler, auth

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

clients = set()
server_thread = None
server_task = None

async def handler(websocket, path):
    """Handles incoming WebSocket connections."""
    clients.add(websocket)
    logger.info(f"Client connected: {websocket.remote_address}")
    try:
        async for message in websocket:
            # Authenticate the client before processing commands
            if not await auth.authenticate(websocket, message):
                continue
            await command_handler.handle_command(websocket, message)
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client disconnected: {websocket.remote_address}")
    finally:
        clients.remove(websocket)

def run_server():
    """Runs the WebSocket server in a separate thread."""
    global server_task
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    start_server = websockets.serve(handler, "localhost", 8765)

    server_task = loop.run_until_complete(start_server)
    logger.info("WebSocket server started on ws://localhost:8765")
    loop.run_forever()

def start_server():
    """Starts the WebSocket server thread."""
    global server_thread
    if server_thread is None or not server_thread.is_alive():
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()

def stop_server():
    """Stops the WebSocket server."""
    if server_task:
        server_task.close()
        logger.info("WebSocket server stopped.")
