
import bpy
import json

def get_scene_info():
    """Returns basic information about the current scene."""
    scene = bpy.context.scene
    info = {
        "scene_name": scene.name,
        "object_count": len(scene.objects),
        "camera_name": scene.camera.name if scene.camera else None,
        "render_engine": scene.render.engine,
    }
    return json.dumps(info)

def execute_script(script_code):
    """Executes a Python script in Blender's context."""
    try:
        exec(script_code, globals())
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}
