# blem
## functional block__element--modifier strings

memoized BEM string generators

### install
```sh
yarn add blem -S
```

### usage
```js
import blem from 'blem'

const bem = blem(`xxx`)

// block
bem() === `xxx`
// block with modifier
bem(``, `cool`) === `xxx xxx--cool`
// block with modifiers
bem(``, `abc`.split(``)) === `xxx xxx--a xxx-b xxx-c`

// element
bem(`yyy`) === `xxx__yyy`
// element with modifier
bem(`yyy`, `zzz`) === `xxx__yyy xxx__yyy--zzz`
// element with modifiers
bem(`yyy`, `abc`.split(``)) === `xxx__yyy xxx__yyy--a xxx__yyy--b xxx__yyy--c`

/*
const X = ({
  bem = blem(`xxx`)
  title
}) => (
  <div className={bem()}>
    <strong className={bem(`title`)}>
      {title}
    </strong>
  </div>
)
*/
```

original implementation credit: Thomas Shaddox @baddox
