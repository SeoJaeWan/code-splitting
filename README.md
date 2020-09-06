# code splitting

## 목차

- SplitChunks

- 자바 스크립트 함수 비동기 로딩

- React.lazy 와 Suspense, Loadable Components

## 정리

미리 이번에 배운 것을 정리 및 소개하자면,

코드 스플리팅은 **자주 변경되는 파일과 자주 바뀌지 않는 파일을 분류하여 캐싱 이점을 누릴 수 있게 해주고 필요할 때 해당 정보를 화면에 렌더링 할 수 있도록 파일을 분류**해준다.
이러한 코드 스플리팅의 방법으론 **웹팩에서 기본적으로 제공하는 SplitChunks와 React.lazy or Suspense 혹은 Loadable Components** 가 있다.

**서버 사이드 렌더링을 할 계획이 없다면 React.lazy와 Suspense로 구현하고, 계획이 있다면 Loadable Components를 사용하여 구현**한다고 한다.

## SplitChunks

리액트 프로젝트를 완성하여 사용자에게 제공할 때는 **빌드 작업을 거쳐서 배포**해야 한다.
빌드 작업을 통해 프로젝트에서 사용되는 자바스크립트 파일 안에서 **불필요한 주석, 경고 메시지, 공백 등을 제거하여 파일 크기를 최소화**하고, 브라우저에서 **JSX 문법이나**
**다른 최신 자바스크립트 문법이 원활하게 실행되도록 코드의 트랜스파일 작업**도 한다.

만약 프로젝트 내에 **이미지와 같은 정적 파일이 있다면 해당 파일을 위한 경로도 설정**된다.

이러한 작업은 **웹팩(webpack)** 이라는 도구가 담당한다.
웹팩에서 별도의 설정을 하지 않으면 프로젝트에서 사용 중인 **모든 자바스크립트 파일이 하나의 파일**로 합쳐지고, **모든 CSS 파일도 하나의 파일**로 합쳐진다.

CRA의 기본 웹팩 설정에는 **SplitChunks**라는 기능이 적용되어 **node_modules에서 불러온 파일, 일정 크기 이상의 파잃, 여러 파일 간에 공유된 파일을 자동으로 분리**해
캐싱 효과를 제대로 누릴 수 있게 해준다.

※ 캐싱 ?
캐싱을 사용하면 이전에 검색하거나 계산한 데이터를 효율적으로 재사용

CRA의 기본 SplitChunks로 Build하면 /build/static안에 자바스크립트 파일 여러 개 만들어 진다.
파일 이름을 보면 "7b7f7f25" 같은 해시 값이 포함되어 있다.

이 값은 빌드하는 과정에서 해당 파일의 내용에 따라 생성되며, 이를 통해 브라우저가 새로 파일을 받아야 할지 말아야 할지 알 수 있다.

여기서 2로 시작하는 파일은 React, ReactDOM 등 node_modules에서 불러온 라이브러리 코드가 들어있고, main으로 시작하는 파일은 직접 프로젝트에 작성한
App 같은 컴포넌트에 대한 코드가 들어 있다.

2로 시작하는 파일은 자주 바뀌지 않은 파일로 분류되어 캐싱의 이점을 더 오래 누릴 수 있다.

2와 main처럼 파일을 분리하는 작업을 **코드 스플리팅**이라고 한다. 프로젝트에 기본 탑재된 SplitChunks 기능을 통한 코드 스플리팅은
**단순히 효율적인 캐싱 효과**만 있을 뿐이다.

예를 들어 페이지 A,B,C로 구성된 싱글 페이지 애플리케이션(SPA)을 개발한다고 가정했을 때, 사용자가 A 페이지를 방문한다면
B 페이지와 C 페이지에서 사용하는 컴포넌트 정보는 필요가 없다.

사용자가 B, C 페이지로 이동하려고 할 때만 필요하다.
하지만 리액트 프로젝트에 별도로 생성하지 않으면 A, B, C 컴포넌트에 대한 코드가 모두 한 파일(main)에 저장되어 버린다.

여기서 만약 애플리케이션의 규모가 커지면 지금 당장 필요하지 않은 컴포넌트 정보도 모두 불러오면서 파일 크기가 매우 커진다.
그러면 로딩도 오래 걸리기 때문에 사용자 경험도 안 좋아지고 트래픽도 많이 나온다.

이러한 문제를 해결해 줄 방법이 **코드 비동기 로딩**이다. 이 또한 코드 스플리팅 방법 중 하나이다.

코드 비동기 로딩을 통해 **자바스크립트 함수, 객체, 혹은 컴포넌트를 처음에는 불러오지 않고 필요한 시점에 불러와서 사용**한다.

## 자바스크립트 함수 비동기 로딩

컴포넌트 코드를 스플리팅하기 앞서 **일반 자바스크립트 함수를 스플리팅**해 보겠다!
src 디렉터리에 notify.js 파일을 생성해 작성한다!

```
export default function notify() {
  alert("안녕하세요!");
}
```

위와 같이 notify 함수를 작성하고

```
 ...

 import notify from "./notify";

 function App() {
  const onClick = () => {
    notify();
  };

  ...
 }
```

App.js에서 import를 상단에 사용해서 호출 후 빌드하면 notify 코드가 main 파일 안에 들어가게 된다..

하지만 import를 상단에서 하지 않고 `import()` 함수 형태로 메서드 안에서 사용하면, **파일을 따로 분리시켜서 저장**한다.
그리고 **실제 함수가 필요한 지점에 파일을 불러와서 함수를 사용**할 수 있다.

```

...

function App() {
  const onClickSplitting = () => {
    import("./notify").then((result) => result.default());
  };

  ...
}

```

import를 함수로 사용하면 `Promise`를 반환한다. 이렇게 import를 함수로 사용하는 문법은 표준 자바스크립트는 아니지만, **dynamic import 라는 문법**입니다.
현재는 웹팩에서 지원하고 있으므로 별도의 설정 없이 프로젝트에서 바로 사용할 수 있다.

브라우저를 열고 개발자 도구의 Network 탭을 연 다음, Hello React!를 눌러보면
클릭하는 시점에 새로운 자바스크립트 파일을 불러올 것이다. 불러온 파일의 내용을 확인해보면 notify에 관련된 코드만 있다!
Cool!

## React.lazy 와 Suspense를 통한 컴포넌트 코드 스플리팅

코드 스플리팅을 위해 리액트에 내장된 기능으로 유틸 함수인 **React.lazy**와 컴포넌트인 **Suspense**가 있다.
이 기능은 리액트 16.6 버전에 도입되었다. 이전 버전에서는 import 함수를 통해 불러온 다음, 컴포넌트 자체를 state에 넣는 방식으로 구현해야 했다.

### state를 사용한 코드 스플리팅

React.lazy를 사용하기에 앞서, 한번 React.lazy 없이 컴포넌트를 스플리팅하려면 어떻게 해야하는지 과거 문명을 알아보자!

먼저 코드 스플리팅할 간단한 컴포넌트를 만들어 준다.

```
import React from "react";

const SplitMe = () => {
  return <div>SplitMe</div>;
};

export default SplitMe;
```

그리고 App 컴포넌트를 클래스형 컴포넌트로 전환시키고 handleClick 메서드를 만들어, 내부에 SplitMe 컴포넌트를 불러와 state에 넣는다.
그렇게해 render 함수에서 state 안 SplitMe가 유효하다면 SplitMe 컴포넌트를 렌더링 해준다.

```
import React, { Component } from "react";

class App extends Component {
  state = {
    SpliteMe: null,
  };

  handleClick = async () => {
    const loadedModule = await import("./Splitting/SplitMe");  // <-
    this.setState({
      SpliteMe: loadedModule.default,
    });
  };

  render() {
    const { SpliteMe } = this.state;
    return (
      <div>
        <p onClick={this.handleClick}>Hello!</p>
        {SpliteMe && <SpliteMe />}
      </div>
    );
  }
}

export default App;

```

잠깐! 굳이 클래스형 컴포넌트만 이 기능이 가능할까???

No No!

```
import React, { useState } from "react";

const App = () => {
  const [render, setRender] = useState({ splitMe: null });

  const handleClick = async () => {
    const loadedModule = await import("./Splitting/SplitMe");
    setRender({ splitMe: loadedModule.default });
  };

  return (
    <div>
      <p onClick={handleClick}>Hello!</p>
      {render.splitMe && <render.splitMe />}
    </div>
  );
};

export default App;

```

함수형 컴포넌트에서도 구현은 가능하다!

### React.lazy 와 Suspense 사용하기

어우 길고도 길었다. React.lazy와 Suspense를 사용하면 코드 스플리팅을 하기 위해 state를 따로 선언하지 않고도
간편하게 컴포넌트 코드 스플리팅을 할 수 있다.

`React.lazy`는 **컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩**할 수 있게 해 주는 **유틸 함수**이다. 아래와 같이 사용할 수 있다.
`const SplitMe = React.lazy(() => import('./SplitMe'));`

Suspense는 리액트 내장 컴포넌트로서 코드 스플리팅된 컴포넌트를 로딩하도록 발동시킬 수 있다.
로딩이 끝나지 않았을 때 보여 줄 UI를 설정할 수도 있다.

```
import React, {Suspense} from 'react';

<Suspense fallback = {<div>loading...</div>}>
  <SplitMe />
</Suspense>
```

Suspense에서 fallback props를 통해 로딩 중 보여 줄 JSX를 지정할 수 있다.

```
import React, { useState, Suspense } from "react";

const SplitMe = React.lazy(() => import("../../Splitting/SplitMe"));

const React_lazy = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div>
      <p onClick={onClick}>Hello!</p>
      {visible && (
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      )}
    </div>
  );
};

export default React_lazy;

```

단순히 SplitMe 컴포넌트의 가시성을 의미하는 visible 이라는 상태만 업데이트하여 코드 스플리팅된 컴포넌트를 보여주었다.

### Loadable Components를 통한 코드 스플리팅

Loadable Components는 코드 스플리팅을 편하게 하도록 도와주는 서드파티 라이브러리다.
이 라이브러리의 이점은 서버 사이드 렌더링을 지원한다는 것이다. 또한 렌더링하기 전에 필요할 때 스플리팅된 파일을
미리 불러올 수 있는 기능도 있다.

yarn add @loadable/component

```

import React, { useState, Suspense } from "react";

import loadable from "@loadable/component";

const SplitMe = loadable(() => import("../../Splitting/SplitMe"));

const Loadable = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div>
      <p onClick={onClick} onMouseOver={onMouseOver}>
        Hello!
      </p>
      {visible && (
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      )}
    </div>
  );
};

export default Loadable;
```

사용 방법은 React.lazy와 비슷하다. 단 Suspense를 사용할 필요가 없다.

```
...

const SplitMe = loadable(() => import("../../Splitting/SplitMe"), {  // <-  로딩
  fallback: <div>loading ...</div>,
});

...

```

로딩 주에 다른 UI를 보야주고 싶다면 위와 같이 fallback을 2번째 인자로 넣어주면 된다.

컴포넌트를 **미리 불러오고(preload) 방법**도 있는데,

```
...

const onMouseOver = () => {
  SplitMe.preload();
};

const Loadable = () => {
  ...
  return (
    <div>
      <p onClick={onClick} onMouseOver={onMouseOver}>  // <-
        Hello!
      </p>
      {visible && (
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      )}
    </div>
  );
};

export default Loadable;

```

위와 같이 수정하면 마우스 커서를 Hello! 위에 올리기만 해도 로딩이 시작된다. 그리고 클릭 시 렌더링이 된다.
이런 기능을 구현하면 사용자에게 더 좋은 경험을 제공할 수 있을 것이다.

Loadable Components는 미리 불러오는 기능 외에도 타임아웃, 로딩 UI 딜레이, 서버 사이드 렌더링 호환 등 다양한 기능을 제공한다.
