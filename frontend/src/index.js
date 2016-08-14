import { h, render } from 'preact'
import App from 'components/app'
import Api from 'src/api'
Api.endpoint = API_ENDPOINT

render(<App />, document.body)
