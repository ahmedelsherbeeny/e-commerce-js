navBar()

function navBar() {
    // navbar toggler btn
    document.querySelector('.toggler-btn').addEventListener('click', function (e) {
        this.classList.toggle('close')
    })

}