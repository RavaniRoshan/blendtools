
import json
from . import blender_bridge

async def handle_command(websocket, message):
    """Parses a command from the WebSocket and executes it."""
    try:
        data = json.loads(message)
        action = data.get("action")
        payload = data.get("payload")

        if action == "get_scene_info":
            response = blender_bridge.get_scene_info()
            await websocket.send(response)
        elif action == "execute_script":
            result = blender_bridge.execute_script(payload.get("code"))
            await websocket.send(json.dumps(result))
        else:
            await websocket.send(json.dumps({"error": "Unknown action"}))
    except json.JSONDecodeError:
        await websocket.send(json.dumps({"error": "Invalid JSON"}))
    except Exception as e:
        await websocket.send(json.dumps({"error": str(e)}))
