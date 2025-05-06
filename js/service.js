let services = JSON.parse(localStorage.getItem("services")) || [
    {
        name: "Gym",
        description: "Dịch vụ tập thể hình chuyên nghiệp",
        image: ""
    },
    {
        name: "Yoga",
        description: "Thư giãn cơ thể với yoga",
        image: ""
    },
    {
        name: "Zumba",
        description: "Nhảy thể thao trên nền nhạc Latinh",
        image: ""
    }

];
localStorage.setItem("services", JSON.stringify(services));

const serviceTableBody = document.getElementById("serviceTableBody");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const serviceName = document.getElementById("serviceName");
const serviceDesc = document.getElementById("serviceDesc");
const serviceImageFile = document.getElementById("serviceImageFile");
const previewImage = document.getElementById("previewImage");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addServiceBtn = document.getElementById("addServiceBtn");

let editingIndex = null;

function renderTable() {
    serviceTableBody.innerHTML = "";
    services.forEach((s, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td class="px-6 py-4 border-b">${s.name}</td>
        <td class="px-6 py-4 border-b">${s.description}</td>
        <td class="px-6 py-4 border-b">
          <img src="${s.image}" class="w-20 rounded" alt="Hình dịch vụ" />
        </td>
        <td class="px-6 py-4 border-b space-x-2">
          <button onclick="editService(${i})" class="text-yellow-600 hover:underline">Sửa</button>
          <button onclick="deleteService(${i})" class="text-red-600 hover:underline">Xóa</button>
        </td>
      `;
        serviceTableBody.appendChild(row);
    });
}

function openModal(isEdit = false) {
    modal.classList.remove("hidden");
    if (isEdit) {
        modalTitle.textContent = "Sửa dịch vụ";
        const s = services[editingIndex];
        serviceName.value = s.name;
        serviceDesc.value = s.description;
        previewImage.src = s.image;
        previewImage.classList.remove("hidden");
    } else {
        modalTitle.textContent = "Thêm dịch vụ";
        serviceName.value = "";
        serviceDesc.value = "";
        serviceImageFile.value = "";
        previewImage.classList.add("hidden");
        editingIndex = null;
    }
}

function closeModal() {
    modal.classList.add("hidden");
}

function editService(index) {
    editingIndex = index;
    openModal(true);
}

function deleteService(index) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        services.splice(index, 1);
        localStorage.setItem("services", JSON.stringify(services));
        renderTable();
    }
}

function saveService() {
    const name = serviceName.value;
    const desc = serviceDesc.value;
    const file = serviceImageFile.files[0];

    if (!name || !desc) return alert("Vui lòng điền đầy đủ thông tin!");

    const handleSave = (imgData) => {
        const newService = { name, description: desc, image: imgData };
        if (editingIndex !== null) {
            services[editingIndex] = newService;
        } else {
            services.push(newService);
        }
        localStorage.setItem("services", JSON.stringify(services));
        renderTable();
        closeModal();
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => handleSave(e.target.result);
        reader.readAsDataURL(file);
    } else {
        const oldImage = editingIndex !== null ? services[editingIndex].image : "";
        handleSave(oldImage);
    }
}


addServiceBtn.addEventListener("click", () => openModal(false));
cancelBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveService);

renderTable();