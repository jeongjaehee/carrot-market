const form = document.querySelector("#login-form");

const handleSubmitForm = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });
  const data = await res.json();
  const accessToken = data.access_token;
  // 이걸 로컬스토리지에 저장하기시작
  window.localStorage.setItem("token", accessToken);
  // 키는 임의로 token이라고 저장 값이 accessToken 임 localstorage f12에서 확인가능 session은 사라지지만 local은 안사라짐

  alert("로그인됐다요");

  window.location.pathname = "/";
};

form.addEventListener("submit", handleSubmitForm);
