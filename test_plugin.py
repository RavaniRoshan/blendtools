
import asyncio
import websockets
import json

async def test_blendtools_bridge():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        # Authenticate
        auth_message = {
            "type": "auth",
            "token": "my-secret-token"
        }
        await websocket.send(json.dumps(auth_message))
        response = await websocket.recv()
        print(f"Auth response: {response}")

        # Get scene info
        get_scene_info_message = {
            "action": "get_scene_info"
        }
        await websocket.send(json.dumps(get_scene_info_message))
        response = await websocket.recv()
        print(f"Scene info: {response}")

if __name__ == "__main__":
    asyncio.run(test_blendtools_bridge())
