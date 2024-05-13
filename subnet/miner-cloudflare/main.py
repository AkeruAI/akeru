import os
from dotenv import load_dotenv
from api.api import app




if __name__ == "__main__":
    load_dotenv()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=os.getenv('PORT', 8080))
