import Vue from 'vue'
import parseISO from 'date-fns/parseISO'
import fromUnixTime from 'date-fns/fromUnixTime'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

Vue.filter('publishedTimeToNow', time => {
  const newDate = parseISO(time)
  return `${formatDistanceToNow(newDate)} ago`
})

Vue.filter('commentTimeToNow', timestamp => {
  const newDate = fromUnixTime(timestamp / 1000)
  const timeElapsed = formatDistanceToNow(newDate, {
    includeSeconds: true,
  })
  return `${timeElapsed} ago`
})
