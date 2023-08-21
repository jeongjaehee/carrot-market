const calcTime = (timestamp) => {
  // 세계시간 기준으로 됨 한국시간 UTC+9 그래서 아래 curTime을 한국시간으로 바꾸기
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
  // 현재시간
  const time = new Date(curTime - timestamp);
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour}시간 전`;
  else if (minute > 0) return `${minute}분 전`;
  else if (second > 0) return `${second}초 전`;
  else "방금전";
};

const renderData = (data) => {
  // data = [{id:1,title:'sss'},{id:2,title:'sss'},{id:3,title:'sss'}....] 이런식으로 왔을거임 그걸 div 등등 뼈대를 붙여서 사이트를 만들어보기
  const main = document.querySelector("main");
  //   오름차순을 내림차순으로 바꾸기 예를들어 array가 a,b,c 면 .reverse() 하면 c,b,a가 됨 data.reverse().forEach(async (obj) =>
  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const ImgDiv = document.createElement("div");
    ImgDiv.className = "item-list__img";

    const imgA = document.createElement("a");
    imgA.href = "#";

    const img = document.createElement("img");
    const res = await fetch(`/images/${obj.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    img.src = url;
    // img 를 blob 타입으로  그걸 url화 시키기

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-list__info";

    const InfoTitle = document.createElement("div");
    InfoTitle.className = "item-list__info-title";
    InfoTitle.innerText = obj.title;

    const InfoMeta = document.createElement("div");
    InfoMeta.className = "item-list__info-meta";
    InfoMeta.innerText = obj.place + "" + calcTime(obj.insertAt);

    const InfoPrice = document.createElement("div");
    InfoPrice.className = "item-list__info-price";
    InfoPrice.innerText = obj.price;

    imgA.appendChild(img);
    ImgDiv.appendChild(imgA);
    InfoDiv.append(InfoTitle);
    InfoDiv.append(InfoMeta);
    InfoDiv.append(InfoPrice);
    div.appendChild(ImgDiv);
    div.appendChild(InfoDiv);
    main.appendChild(div);
  });
};

const fetchList = async () => {
  const res = await fetch("/items");
  const data = await res.json();
  renderData(data);
  // 어디로 받아올것인가?/"items"로 get요청으로 받아와서 쭉 조회하는 방식
};
/* 서버로부터 데이터 받기 */
fetchList();
