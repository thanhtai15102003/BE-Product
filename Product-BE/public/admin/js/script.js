//Button status
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach((button) => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');
            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }
            console.log(url.href);
            window.location.href = url.href;
        });
    });
}
// end Button status

// Chức năng tìm kiếm sản phẩm Admin
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        console.log(e.target.elements.keyword.value);
        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;
    });
}
// End Chức năng tìm kiếm sản phẩm Admin

// Chức nang9 Pagination
const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach((button) => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            url.searchParams.set('page', page);
            window.location.href = url.href;
        });
    });
}
// End Chức nang9 Pagination

// Show Alert
const alert = document.querySelector('[show-alert]');
if (alert) {
    const time = parseInt(alert.getAttribute('data-time'));
    const closeAlert = alert.querySelector('[close-alert]');
    setTimeout(() => {
        alert.classList.add('alert-hidden');
    }, time);
    
    closeAlert.addEventListener('click', () => {
        alert.classList.add('alert-hidden');
    });
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener("change", (e) => {
        console.log(e);
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}

// End Upload Image