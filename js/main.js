function isVietnamesePhoneNumber(number) {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}


let users = JSON.parse(localStorage.getItem("users")) || [
    {
        id: 1,
        email: "hoangduongnampb.2k6@gmail.com",
        password: "12345678",
        fullName: "Hoàng Dương Nam",
        phoneNumber: "0899769862",
        role: "Admin",
        createdAt: "08-09-2025"
    }
];

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users))
} else {
    users = JSON.parse(localStorage.getItem("users"))
}
let isLoggedIn = false;
function updateData() {
    localStorage.setItem("users", JSON.stringify(users));
}

function register(e) {
    e.preventDefault();
    let confirm = true;
    let email = e.target.email.value;
    let fullName = e.target.fullName.value;
    let phoneNumber = e.target.phoneNumber.value;
    let passwordInput = e.target.passwordInput.value;
    let confirmInput = e.target.confirmInput.value;

    document.querySelector(".errorFullName").textContent = ``;
    document.querySelector(".errorEmail").textContent = ``;
    document.querySelector(".errorPhone").textContent = ``;
    document.querySelector(".errorPass").textContent = ``;
    document.querySelector(".errorConfirm").textContent = ``;

    if (fullName == ``) {
        document.querySelector(".errorFullName").textContent = `Tên không được để trống`;
        confirm = false;
    }

    if (email == ``) {
        document.querySelector(".errorEmail").textContent = `Email không được để trống`;
        confirm = false;
    } else {
        if (!validateEmail(email)) {
            document.querySelector(".errorEmail").textContent = `Không đúng định dạng email`;
            confirm = false;
        } else {
            if (users.some(user => user.email == email)) {
                document.querySelector(".errorEmail").textContent = `Email này đã được đăng ký tài khoản`;
                confirm = false;
            }
        }
    }

    if (phoneNumber == ``) {
        document.querySelector(".errorPhone").textContent = `Số điện thoại không được để trống`;
        confirm = false;
    } else {
        if (!isVietnamesePhoneNumber(phoneNumber)) {
            document.querySelector(".errorPhone").textContent = `Không đúng định dạng số điện thoại Việt Nam`;
            confirm = false;
        }
    }

    if (passwordInput == ``) {
        document.querySelector(".errorPass").textContent = `Mật khẩu không được để trống`;
        confirm = false;
    } else {
        if (passwordInput.length < 8) {
            document.querySelector(".errorPass").textContent = `Mật khẩu phải có độ dài tối thiểu là 8`;
            confirm = false;
        }
    }

    if (confirmInput == "") {
        document.querySelector(".errorConfirm").textContent = `Mật khẩu xác nhận không được để trống`;
        confirm = false;
    } else {
        if (confirmInput != passwordInput) {
            document.querySelector(".errorConfirm").textContent = `Mật khẩu xác nhận không trùng khớp`;
            confirm = false;
        }
    }

    if (confirm) {
        users.push({
            id: users.length + 1,
            email: email,
            fullName: fullName,
            role: "User",
            phoneNumber: phoneNumber,
            password: passwordInput,
            createdAt: new Date().toLocaleDateString()
        });

        alert("Đã thêm tài khoản thành công");
        updateData();
        e.target.reset();
        window.location.assign("/pages/auth/login.html");
    }
}


function login(e) {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    document.querySelector(".errorLoginEmail").textContent = ``;
    document.querySelector(".errorLoginPass").textContent = ``;

    let confirm = true;

    if (email == ``) {
        document.querySelector(".errorLoginEmail").textContent = `Email không được để trống`;
        confirm = false;
    }

    if (password == ``) {
        document.querySelector(".errorLoginPass").textContent = `Mật khẩu không được để trống`;
        confirm = false;
    }

    if (confirm) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
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
        localStorage.setItem("isLoggedIn", "true");

        if (user.role === "Admin") {
            localStorage.setItem("isAdmin", "true");
        }

        if (!localStorage.getItem(`bookings_${user.id}`)) {
            localStorage.setItem(`bookings_${user.id}`, JSON.stringify([]));
        }

        alert("Đăng nhập thành công!");
        window.location.assign('/index.html');
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("isAdmin");
    const adminBtn = document.getElementById("adminBtn");

    if (isAdmin === "true" && adminBtn) {
        adminBtn.style.display = "inline";
    }
});
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function updateBookings() {
    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
}

function renderBookings() {
    const tbody = document.querySelector("#bookingTable tbody");
    tbody.innerHTML = "";
    bookings.forEach((booking, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${booking.classType}</td>
            <td>${booking.date}</td>
            <td>${booking.timeSlot}</td>
            <td>${booking.fullName}</td>
            <td>${booking.email}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const services = JSON.parse(localStorage.getItem("services")) || [];
    const serviceCardsContainer = document.getElementById("serviceCards");

    services.forEach(service => {
        const card = document.createElement("div");
        card.className = "col mx-auto";
        card.innerHTML = `
        <div class="card h-100">
          <img src="${service.image}" class="card-img-top" alt="${service.name}">
          <div class="card-body">
            <h5 class="card-title">${service.name}</h5>
            <p class="card-text">${service.description}</p>
            <a href="/pages/booking/schedule.html" class="btn btn-primary mt-2">Đặt lịch</a>
          </div>
        </div>
      `;
        serviceCardsContainer.appendChild(card);
    });
});
