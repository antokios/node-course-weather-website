const weatherForm = document.querySelector('form')
const weatherFormButton = weatherForm.querySelector('button')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const myWeather = document.querySelector('#myWeather')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = search.value

    loadingMessage()

    const promiseData = fetch(`/weather?address=${location}`)
    display(promiseData)
})

myWeather.addEventListener('click', (e) => {
    e.preventDefault()

    loadingMessage()

    navigator.geolocation.getCurrentPosition(({ coords },error) => {
        if(!error){
            const promiseData = fetch(`/myWeather?latitude=${coords.latitude}&longitude=${coords.longitude}`)
            display(promiseData)
        }
    })
})

// Fetch promise handling
const display = (promiseData) => {
    promiseData.then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
                messageTwo.textContent = ""
            }

            messageOne.textContent = data.location
            messageTwo.textContent = data.forecast
        })
    })
}


// Temporary message while waiting to receive info
const loadingMessage = () => {
    messageOne.textContent = 'Loading ...'
    messageTwo.textContent = ""
}