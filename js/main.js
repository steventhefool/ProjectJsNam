function isVietnamesePhoneNumber(number) {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
let users = [
    {
        id: 1,
        email: "hoangduongnampb.2k6@gmail.com",
        password: "12345678",
        fullName: "Hoàng Dương Nam",
        phoneNumber: "0899769862",
        role: "User",
        createdAt: "08-09-2025"
    }
]
function updateData() {
    localStorage.setItem("currentUser", JSON.stringify(users))
}
if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(users))
}
else {
    currentUser = JSON.parse(localStorage.getItem("currentUser"))
}
function register(e) {
    e.preventDefault();
    let confirm = true;
    let email = e.target.email.value;
    let fullName = e.target.fullName.value;
    let phoneNumber = e.target.phoneNumber.value;
    let passwordInput = e.target.passwordInput.value;
    let confirmInput = e.target.confirmInput.value;
    console.log(email);
    document.querySelector(".errorFullName").textContent =``;
    document.querySelector(".errorEmail").textContent = ``;
    document.querySelector(".errorPhone").textContent = ``;
    document.querySelector(".errorPass").textContent = ``;
    document.querySelector(".errorConfirm").textContent = ``;
    if (fullName==``){
        document.querySelector(".errorFullName").textContent =`Tên không được để trống`;
    } 
    if (email == ``) {
        document.querySelector(".errorEmail").textContent = `Email không được để trống`;
        confirm = false;
    }
    else {
        const currentUsers = JSON.parse(localStorage.getItem("currentUser")) || [];
        if (!validateEmail(email)) {
            document.querySelector(".errorEmail").textContent = `Không đúng định dạng email`;
            confirm = false;
        }
        else {
            if (currentUsers.some(user => user.email == email)) {
                document.querySelector(".errorEmail").textContent = `Email này đã được đăng ký tài khoản`;
                confirm = false;
            }
        } 
    }
    if (phoneNumber == ``) {
        document.querySelector(".errorPhone").textContent = `Số điện thoại không được để trống`;
        confirm = false;
    }
    else {
       if (!isVietnamesePhoneNumber(phoneNumber)) {
        document.querySelector(".errorPhone").textContent = `Không đúng định dạng số điện thoại Việt Nam`;
        confirm = false;
    } 
    }
    
    if (passwordInput == ``) {
        document.querySelector(".errorPass").textContent = `Mật khẩu không được để trống`;
        confirm = false;
    }
    else {
        if (passwordInput.length < 8) {
        document.querySelector(".errorPass").textContent = `Mật khẩu phải có độ dài tối thiểu là 8`;
        confirm = false;
    }
    }
    if (confirmInput == "") {
        document.querySelector(".errorConfirm").textContent = `Mật khẩu xác nhận không được để trống`;
        confirm = false;
    }
    else {
        if (confirmInput != passwordInput) {
        document.querySelector(".errorConfirm").textContent = `Mật khẩu xác nhận không trùng khớp`;
        confirm = false;
    }
    }
    
    if (confirm) {
        users.push({
            email: email,
            fullName: fullName,
            role: "User",
            phoneNumber: phoneNumber,
            password: passwordInput
        })
        e.target.email.value = ``
        e.target.fullName.value = ``
        e.target.phoneNumber.value = ``
        e.target.passwordInput.value = ``
        e.target.confirmInput.value = ``
        alert("Đã thêm tài khoản thành công");
        updateData();
        window.location.assign("http://127.0.0.1:5500/pages/auth/login.html")
    }
}

function login(e) {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    document.querySelector(".errorLoginEmail").textContent = ``;
    document.querySelector(".errorLoginPass").textContent = ``;

    let confirm = true;

    if (email === ``) {
        document.querySelector(".errorLoginEmail").textContent = `Email không được để trống`;
        confirm = false;
    }

    if (password === ``) {
        document.querySelector(".errorLoginPass").textContent = `Mật khẩu không được để trống`;
        confirm = false;
    }

    if (confirm) {
        const users = JSON.parse(localStorage.getItem("currentUser")) || [];
        const user = users.find(user => user.email === email);

        if (!user) {
            document.querySelector(".errorLoginEmail").textContent = `Email không tồn tại hoặc chưa được đăng ký`;
            return;
        }

        if (user.password !== password) {
            document.querySelector(".errorLoginPass").textContent = `Mật khẩu không chính xác`;
            return;
        }
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Đăng nhập thành công!");
        window.location.assign("http://127.0.0.1:5500/index.html");
    }
}
