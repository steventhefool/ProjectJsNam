let isLoggedIn = false;
let isEditing = false;
let editingIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    renderBookings();
});

function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user ? user.id : null;
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        if (href.includes('index.html')) {
            window.location.href = '/index.html';
        } else {
            window.location.href = '';
        }
    });
});


function openBookingForm(booking = null, index = null, preSelectedClass = null) {
    isEditing = booking ? true : false;
    editingIndex = index;

    const modalHTML = `
    <div id="bookingModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;">
        <div style="background:white;padding:2rem;border-radius:8px;width:340px;position:relative;">
            <h3>${isEditing ? 'Sửa lịch tập' : 'Đặt lịch mới'}</h3>
            <form id="bookingForm">
                <div id="errorBox" style="color:red;margin-bottom:1rem;"></div>

                <div style="margin-bottom:1rem;">
                    <label>Lớp học</label><br>
                    <select id="classSelect" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                        <option value="">Chọn lớp học</option>
                        <option value="Gym">Gym</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Zumba">Zumba</option>
                    </select>
                </div>
                <div style="margin-bottom:1rem;">
                    <label>Ngày tập</label><br>
                    <input type="date" id="dateInput" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                </div>
                <div style="margin-bottom:1rem;">
                    <label>Khung giờ</label><br>
                    <select id="timeSelect" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                        <option value="">Chọn khung giờ</option>
                        <option value="06:00 - 07:00">06:00 - 07:00</option>
                        <option value="07:00 - 08:00">07:00 - 08:00</option>
                        <option value="17:00 - 18:00">17:00 - 18:00</option>
                        <option value="18:00 - 19:00">18:00 - 19:00</option>
                    </select>
                </div>
                <div style="margin-bottom:1rem;">
                    <label>Họ tên</label><br>
                    <input type="text" id="fullName" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                </div>
                <div style="margin-bottom:1rem;">
                    <label>Email</label><br>
                    <input type="email" id="emailInput" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                </div>
                <div style="display:flex;justify-content:end;gap:1rem;">
                    <button type="button" onclick="closeBookingForm()" style="background:#6b7280;color:white;padding:0.5rem 1rem;border:none;border-radius:5px;">Hủy</button>
                    <button type="submit" style="background:#3b82f6;color:white;padding:0.5rem 1rem;border:none;border-radius:5px;">${isEditing ? 'Cập nhật' : 'Lưu'}</button>
                </div>
            </form>
        </div>
    </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);
    const classSelect = document.getElementById('classSelect');
    if (isEditing && booking) {
        classSelect.value = booking.class;
        document.getElementById('dateInput').value = booking.date;
        document.getElementById('timeSelect').value = booking.time;
        document.getElementById('fullName').value = booking.fullName;
        document.getElementById('emailInput').value = booking.email;
    } else if (preSelectedClass) {
        classSelect.value = preSelectedClass;
    }

    document.getElementById('bookingForm').addEventListener('submit', saveBooking);
}


function closeBookingForm() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.parentElement.removeChild(modal);
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
        errorBox.innerText = message;
    }
}

function saveBooking(e) {
    e.preventDefault();

    const userId = getCurrentUserId();
    if (!userId) {
        showError("Bạn cần đăng nhập để đặt lịch!");
        return;
    }

    let userBookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];
    const now = new Date().toISOString();

    const newBooking = {
        class: document.getElementById('classSelect').value,
        date: document.getElementById('dateInput').value,
        time: document.getElementById('timeSelect').value,
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('emailInput').value.trim(),
        status: `Chưa xong`,
    };

    if (!newBooking.class || !newBooking.date || !newBooking.time || !newBooking.fullName || !newBooking.email) {
        showError("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    if (isEditing) {
        const existingBooking = userBookings[editingIndex];
        newBooking.createdAt = existingBooking.createdAt || now;
        newBooking.updatedAt = now;
        userBookings[editingIndex] = newBooking;
    } else {
        newBooking.createdAt = now;
        newBooking.updatedAt = now;
        userBookings.push(newBooking);
    }

    localStorage.setItem(`bookings_${userId}`, JSON.stringify(userBookings));
    loadBookings();
    closeBookingForm();
}

function loadBookings() {
    const userId = getCurrentUserId();
    if (!userId) {
        showError("Bạn cần đăng nhập để xem lịch đặt!");
        return;
    }

    const bookingList = document.getElementById('bookingList');
    bookingList.innerHTML = '';

    const userBookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];

    userBookings.forEach((booking, index) => {
        const createdAt = booking.createdAt ? booking.createdAt.split('T')[0] : '';
        const updatedAt = booking.updatedAt ? booking.updatedAt.split('T')[0] : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.class}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.fullName}</td>
            <td>${booking.email}</td>
            <td>${booking.status}</td>
            <td>${createdAt}</td>
            <td>${updatedAt}</td>
            <td>
                <button onclick="editBooking(${index})" style="background:#3b82f6;color:white;border:none;padding:0.3rem 0.6rem;border-radius:5px;">Sửa</button>
                <button onclick="confirmDeleteBooking(${index})" style="background:red;color:white;border:none;padding:0.3rem 0.6rem;border-radius:5px;margin-left:5px;">Xóa</button>
            </td>
        `;
        bookingList.appendChild(tr);
    });
}


function editBooking(index) {
    const userId = getCurrentUserId();
    const bookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];
    openBookingForm(bookings[index], index);
}


function confirmDeleteBooking(index) {
    const confirmHTML = `
    <div id="confirmModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;">
        <div style="background:white;padding:2rem;border-radius:8px;width:300px;text-align:center;">
            <p>Bạn có chắc chắn muốn xóa lịch này không?</p>
            <div style="margin-top:1.5rem;display:flex;justify-content:center;gap:1rem;">
                <button onclick="deleteBooking(${index})" style="background:red;color:white;padding:0.5rem 1rem;border:none;border-radius:5px;">Xóa</button>
                <button onclick="closeConfirmModal()" style="background:gray;color:white;padding:0.5rem 1rem;border:none;border-radius:5px;">Hủy</button>
            </div>
        </div>
    </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = confirmHTML;
    document.body.appendChild(div);
}


function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.parentElement.removeChild(modal);
}

function deleteBooking(index) {
    const userId = getCurrentUserId();
    const bookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];
    bookings.splice(index, 1);
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookings));
    loadBookings();
    closeConfirmModal();
}

function renderBookings() {
    const userId = getCurrentUserId();
    if (userId) {
        document.getElementById('userProfile').style.display = 'block';
        loadBookings();
    } else {
        document.getElementById('userProfile').style.display = 'none';
    }
}

loadBookings();
