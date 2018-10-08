# blem
## functional block__element--modifier strings

memoized bem string generators

### install
```sh
yarn add blem -S
```

### usage
```js
import blem from 'blem'

const bem = blem(`xxx`)

bem() === `xxx`
bem(`yyy`) === `xxx__yyy`
bem(`yyy`, `zzz`) === `xxx__yyy xxx__yyy--zzz`
bem(`yyy`, `abc`.split(``)) === `xxx__yyy xxx__yyy--a xxx__yyy--b xxx__yyy--c`

/*
const X = ({
  bem = blem(`xxx`)
  title
}) => <div className={bem()}>
  <strong className={bem(`title`)}>
    {title}
  </strong>
</div>
*/
```
