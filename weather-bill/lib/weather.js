export async function getStaticProps() {
  const res = await fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=3c89aa25e1ffe7033918798686e4e89a')
  .then(response => response.json())
  .then(data => console.log(data))

.catch(err => alert("Wrong city name!"))

  const post = await res.json()

  // Pass post data to the page via props
  return {
    props: {
      post
    }
  }
}
