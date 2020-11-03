export default function({ $axios }) {
  $axios.onRequest(config => {
    config.headers.common['Authorization'] = process.env.newsAPIKey
    console.log('news API key', process.env.newsAPIKey)
  })
}
