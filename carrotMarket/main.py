from fastapi import FastAPI,UploadFile,Form,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

con = sqlite3.connect('db.db',check_same_thread=False)
cur = con.cursor()

cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                image BLOB,
                price INTEGER NOT NULL,
                description TEXT,
                place TEXT NOT NULL,
                insertAt INTEGER NOT NULL
            );
            """)

app = FastAPI()



@app.post('/items')
async def create_item(
                title:Annotated[str,Form()],
                image:UploadFile,
                price:Annotated[int,Form()],
                description:Annotated[str,Form()],
                place:Annotated[str,Form()],
                insertAt:Annotated[int,Form()]):
    image_bytes = await image.read()
    cur.execute(f"""
                INSERT INTO items(title,image,price,description,place,insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """)
    con.commit()
    return '200'
#  post라는 메소드를 /item이라는경로로 보내게 되면 밑의 작업들이 이루어질것이다 """
@app.get('/items')
async def get_items():
    
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * from items
                       """).fetchall()

    return JSONResponse(jsonable_encoder(dict(row) for row in rows))
# 컬럼명도 같이 가져오게하기
    # sqlite3.connect()를 사용해서 데이터베이스 파일을 열고 연결한다.
    # connection.execute()를 사용해서 쿼리를 전송하고 실행할 수 있다.
    # execute()의 결과로 cursor 객체를 얻게 되는데,
    # `row_factory` 값을 `sqlite3.Row`로 주면 각 칼럼의 이름으로 값을 액세스할 수 있는
# dict-like 객체가 된다. cs.row_factory = sqlite3.Row for row in cs.fetchall(): print(row['id'], row['word'])
# items라는 겟요청이 들어오면 어떻게 할것인가

@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id = {item_id}
                              """).fetchone()[0]
    return Response(content=bytes.fromhex(image_bytes), media_type ='image/*')
# 16진법임
# 각각의 colume id별로 받아오기 /{item_id}
@app.post('/signup')
def signup(id:Annotated[str,Form()],
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str,Form()]):
    cur.execute(f"""
                INSERT INTO users(id,name,email,password)
                VALUES ('{id}','{name}','{email}','{password}')
                """)
    con.commit()
    return '200'
           
app.mount("/", StaticFiles(directory="frontend",html=True), name="frontend")