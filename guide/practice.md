프로젝트에 `React/Redux`를 적용할 때 미리 알고 있으면 좋을만한 practice을 정리한다. 만약에 기본적인 `React의 사용법을 다루지 않기 때문에 `React`의 사용법을 학습해야 한다.

# 시작하기
`React`을 사용하기 위해 설정해야 하는 도구들이 많다. 그래서 직접 설정하는 방법도 있지만, [`React Starter Kit`](https://www.reactstarterkit.com/)등 다양한 scaffold 도구를 사용한다. 여기서는 `facebook`에서 만든 [`create-react-app`](https://github.com/facebookincubator/create-react-app) 도구를 사용한다. `create-react-app`을 사용한 이유는 `react`을 개발하는 `facebook`이 만들었고, 다른 도구에 비해서 기능을 작지만, 쉽고 편하게 쓸 수 있다. 만약에 `server rendering`등 다양한 기능을 사용하고 싶다면, `React Starter Kit`도 좋은 선택이 될 수 있다.

## 설치하기
```
npm install -g create-react-app //설치

create-react-app my-app // project 생성
cd my-app // 이동
```

## command
```
npm start // 시작(자동 브라우저 실행)
npm run build // production mode로 파일 빌드해서 build폴더에 생성
```

해당 저장소는 `create-react-app`을 사용하여 만들어져 있습니다.

# 폴더 구조

여기서는 단순히 `react`을 사용하는 프로젝트 보다는 일반적으로 프로젝트에서 redux을 많이 사용하기 때문에 [redux-book](http://redux.js.org/docs/advanced/ExampleRedditAPI.html)의 폴더 구조를 기준으로 작성했다. 여기서 말한 폴더 구조는 제안하는 방법으로 자신의 프로젝트에 맞게 변경하면 된다.

![image](https://media.oss.navercorp.com/user/244/files/75c96e76-7420-11e6-9d3a-b50ec1fa0cc1)

위의 그림에서 보듯이 크게 `action`, `component`, `reducer`, `store`로 구분되어 있다.

## action
`action`폴더는 `사용하는 명령어`와 API통신등의 작업을 하는 `action메서드`들로 구성된 파일이다. 어떤 서비스의 경우에는 모든 `명령어`와 `action`을 한곳에 모아두기도 하고, 각 도메인 별로 구분하기도 한다. 비동기 통신이 필요한 경우는 [아래](#비동기-처리)에서 다룰 [react-thunk](https://github.com/gaearon/redux-thunk), [react-saga](https://github.com/barbuza/react-saga)을 사용해야 하기 때문에 간단한 예제를 작성한다.

![image](https://media.oss.navercorp.com/user/244/files/9ff473ce-9d30-11e6-8d8c-4ded3cb8f79d)

**[action/todo.js]**
```js
// action type(명령어)
export const COMPLETE_TODO = 'COMPLETE_TODO'


// action creators(action메서드)
export function complete({complete, id}) {
	return { type: COMPLETE_TODO,  complete, id};
}
```

## component
`component`는 `action`과 다르게 보통 `domain`별로 구분되어 있다. 각 컴포넌트는 `Container Component`와 `Presentational Component`을 구분해서 개발을 한다. `Container Component`는 다수의 `Presentational Component`로 구성되어 있으며 데이터나 공통으로 관리해야 하는 객체, 다른 컴포넌트간의 인터랙션등을 관리하는 컴포넌트이다.  `Presentational Component`는 우리가 일반적으로 알고있는 `UI컴포넌트`로 생각하면 된다. 즉, `UI컴포넌트`인 `Presentational Component`을 `Container Component`에서 관리한다고 생각하면 간단하다. 그리고 좀 더 자세히 알아보고 싶다면 [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.jgn6dixap)을 참고하실 바란다.

![image](https://media.oss.navercorp.com/user/244/files/54b378b6-7421-11e6-8690-33fffedc5f96)

**Container Component(component/todolist/TODOList.js)**
```js
class TODOList extends Component {
  render() {
  	const {todos, onClick} = this.props;
    return (
      <ul>
    		{todos.map(todo =>
    			<Todo 
    				key={todo.id}
    				onClick={onClick}
    				{...todo}
    			/>
    		)}
      </ul>
    );
  }
}

// Container에서 Presentational으로 전달
const todolistStateToProps = (state) => { 
  return {
    todos: state.todos
  }
}

// Container에서 Presentational으로 전달
const todolistDispatchToProps = (dispatch) => { 
    return {
        onClick(data){
          dispatch(complete(data)) // action 메서드
        }
    }
}

// 연결
export default connect(todolistStateToProps,todolistDispatchToProps)(TODOList);
```

**Presentational Component(component/todolist/TODO.js)**
```js
class TODO extends Component {
  render() {
  	const {id, todo, complete, onClick} = this.props; // Container에서 연결된 prop/action들
    return (
      <li id={id} 
      	onClick={() => onClick({
      		id : id, 
      		complete : !complete
      	})}
      	className={!!complete ? 'completed' : ''}
      >{todo}</li>
    );
  }
}
```
이렇게 `Presentational Component`에서는 비지니스 로직이 없고 비지니스 로직은 `Container Component`에서 개발한다. 이렇게 해야 TODO컴포넌트의 재활용성이 높아진다.


## reducer
`reducer`는 `action`에서 실행시킨 변경을 기존의 상태에서 적용하는 일을 한다. `reducer`는 `action`과 같이 하나로 만들기도 하지만 각 `domain`별로 만들기도 한다. 혹은 `action`파일과 `reducer`파일을 합쳐서 사용하는 [`duck이라는 기법`](https://github.com/erikras/ducks-modular-redux)이 있다. 여기서는 `action`을 `reducer`와 분리하고 `reducer`을 다수의 파일로 분리하는 방법을 사용한다.
아래와 같이 각각의 파일을 분리하고 `index.js`에서는 분리한 `reducer`들을 합치는 작업을 한다.

![image](https://media.oss.navercorp.com/user/244/files/8cc0cdcc-742a-11e6-8869-06a9d8732da0)

**[reducer/todo.js]**
```js
import todoAction from '../action/index';
const {ADD_TODO} = todoAction.todo;

const todo = (state, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        text: action.text,
        completed: false
      };
    default:
      return state;
  }
}


const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state, todo(undefined, action)
      ];
    default:
      return state;
  }
}
```
**[reducer/index.js]**
```js
export default combineReducers({
  todos
});
```

## store
해당 폴더에는 `index.js`하나만 있으며 주로 하는 미들웨어를 설정하는 일을 한다. 예를 들어 비동기 통신을 사용하기 위에 `redux-thunk`을 [설정](#Middleware)하거나, 히스토리 관리를 하기 위해 router을 설정하거나, 디버깅을 위해 [react-devtool](#디버깅-도구)을 설정하는 일을 주로 한다.

![image](https://media.oss.navercorp.com/user/244/files/9f6da792-7538-11e6-80dd-bf20b353cd59)

**[store/index.js]**
```js
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

export default function configureStore(reducer, initialState = {}) {

  const storeEnhancers = compose(
    applyMiddleware(thunk)
  );

  return createStore(reducer, initialState, storeEnhancers);
}
```


# Middleware

미들웨어는 간단하게 보면 `dispatch` 전/후에 원하는 작업을 할 수 있다. 예를 들어, `dispatch`전에 전/후를 `state`의 변화를 알 수 있거나, 비동기 통신의 경우 `callback`에서 `dispatch`을 할 수 있다. 좀 더 자세한 내용은 링크를 참고하길 바란다. [링크](https://dobbit.github.io/redux/docs_kr/advanced/Middleware.html)

이중 많이 사용하는 미들웨어의 활용의 예를 알아본다.

## 비동기 처리
개발하다보면 서버에서 비동기로 데이터를 가져와서 처리하거나, 애니메이션이 끝난 후 처리하기 해야 하는 상황이 있다.
```js
export function addTodo(text) {
	return { type: ADD_TODO,  text};
}
```
예를 들어, 위의 코드에서 `text`을 `Ajax`로 서버에 전달할 후 `todo`을 추가하고 싶다고 하면, 일반적인 `actionCreator`로는 처리할 수 없다.  그래서 [`redux-thunk`](https://github.com/gaearon/redux-thunk)와 같은 미들웨어를 사용한다. 여기서는 `thunk`을 예로 설명한다. 그 밖에 비동기를 처리하는 다양한 라이브러리가 있으며 [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)을 사용하는 [`redux-saga`](https://github.com/yelouafi/redux-saga)가 있으며 차이는 [링크](http://jaysoo.ca/2016/01/03/managing-processes-in-redux-using-sagas/)을 통해서 알 수 있다.

**[store/index.js]**
```js
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

export default function configureStore(reducer, initialState = {}) {

  const enhancer = compose(
    applyMiddleware(thunk/* , middleware 추가*/)
  );

  return createStore(reducer, initialState, enhancer);
}
```

**action/todo.js**

아래와 같이 `dispatch`을 인자로 받는 함수를 만들고 응답이 온 후 `dispatch`을 호출하면 정상적으로 비동기 통신을 적용할 수 있다.
```js
export function addTodo2(text) {
  return (dispatch) => {
	return fetch("api/add.json").then(
		res => res.json().then(data => dispatch(addTodo(data.status)))
	);
  };
}
```

## 로깅하기
로깅에서도 활용할 수 있다. [간단하게 직접 구현](https://dobbit.github.io/redux/docs_kr/advanced/Middleware.html#%EC%9D%BC%EA%B3%B1%EA%B0%80%EC%A7%80-%EC%98%88%EC%8B%9C) 할 수 있지만, [`redux-logger`](https://github.com/evgenyrodionov/redux-logger) 와 같은 라이브러리를 사용하여 로깅을 할 수 있다.

```js
import { createStore, compose, applyMiddleware } from "redux";
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import thunk from "redux-thunk";

export default function configureStore(reducer, initialState = {}) {
	const logger = createLogger();
	const enhancer = compose(
		applyMiddleware(thunk,promise, logger/* , middleware 추가*/)
	);
	return createStore(reducer, initialState, enhancer);
}
```

이렇게 `middleware`을 사용하여 `dispatch전/후`로 관련한 작업을 사용할 수 있다. 하지만 로깅의 경우 위와 같이 `redux-logger`을 사용하기도 하지만 일반적으로는 [디버깅 도구](#디버깅-도구) 사용하여 디버깅하기 때문에 참고만 하길 바란다.

# state/prop의 구분

React에서는 state와 prop을 구분하고 있다. 얼핏보면 두개가 비슷해보이지만, 사용방법이 다르다. 간단하게 구분하자면, state는 독립적인 component의 상태, prop은 global하게 App에서 관리하는 상태라고 생각하면 된다.
> 예를 들어, 특정 영역이 클릭했을 때 하이라이팅이 되어야 한다고 생각해보자. 

하이라이팅 되는건 부모 컴포넌트나 앱에서 알아야 하는 부분은 아니고 그냥 자신 컴포넌트의 스타일링에 대한 부분이기 때문에 아래와 같이 setState로 state을 변경한다. setState가 발생하면 자신의 컴포넌트의 render가 호촐되어 해당 컴포넌트만 갱신한다.

```js
class TODO extends Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {
				backgroundColor: getRandomColor()
			}
		};
		this.changeColor = this.changeColor.bind(this);
	}
	changeColor(){
		this.setState({
			style: {
				backgroundColor: getRandomColor()
			}
		});
	}
	render() {
		const {id, todo, complete} = this.props;
		return (
		  <li id={id} 
		  	onClick={this.changeColor}
		  	style={this.state.style}
		  >{todo}</li>
		);
	}
}
```
Prop은 global하게 App에서 관리하는 상태이다. 
> 예를 들어, 위와 같이 단순히 색상을 바꾸는게 아니라 아래와 같이 `complete`을 처리한다고 생각해보자.

`complete`는 `TODO`만의 상태이기보다 App의 TODO 상태가 맞기 때문에 이런 경우는 아래와 같이 `dispatch`을 이용하여 상태를 관리한다. `prop`의 경우는 container component에서 관리한다.
```js
class TODO extends Component {
  render() {
  	const {id, todo, complete, onClick} = this.props;
    return (
      <li id={id} 
      	onClick={() => onClick({
      		id : id, 
      		complete : !complete
      	})}
      	className={!!complete ? 'completed' : ''}
      >{todo}</li>
    );
  }
}
```

요약하면, 컴포넌트 자체의 상태(색상, 애니메이션...)는 `state`로 처리하고 전체적으로 관리(Ajax..)해야 하는 경우는 부모에게 `prop`으로 받아서 처리한다. 물론 `prop`의 경우는 App전반적으로 갱신이 되기 때문에 비교적 `state`보다는 느릴 수 밖에 없기 때문에 효과적으로 `state`을 사용하면 좋지만, `prop`으로 처리해야 하는 이슈를 `state`로 처리하는 건 코드를 더 어렵게 한다. 좀 더 자세한 내용은 [props vs state](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)이 도움이 된다.

## connect
`prop`은 `state`와 다르게 `container component`에서 관리한다. 그래서 `container component`에서 `presentational component`으로 전달해야 하는데 이 때 사용하는 메서드가 `react-redux`에서 제공하는 `connect`이다.

**[component/todolist/TODOList.js]**
```js
class TODOList extends Component {
  render() {
  	const {todos, onClick} = this.props;
    return (
      <ul>
    		{todos.map(todo =>
    			<Todo 
    				key={todo.id}
    				onClick={onClick}
    				{...todo}
    			/>
    		)}
      </ul>
    );
  }
}

const todolistStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const todolistDispatchToProps = (dispatch) => {
    return {
        onClick(data){
          dispatch(complete2(data))
        }
    }
}
export default connect(todolistStateToProps,todolistDispatchToProps)(TODOList);
```
`container component`인 TODOList에서 connect로 속성과 dispatch를 연결하고 이를 `Todo`에게 전달하여 사용한다.

**[component/todolist/TODO.js]**
```js
class TODO extends Component {
  render() {
  	const {id, todo, complete, onClick} = this.props;
    return (
      <li id={id} 
      	onClick={() => onClick({
      		id : id, 
      		complete : !complete
      	})}
      	className={!!complete ? 'completed' : ''}
      >{todo}</li>
    );
  }
}
```
connect는 2가지을 인자로 받는데 첫 번째는 인자로 현재 `state`을 받는 함수와 두 번째는 `dispatch`을 인자로 받는 함수이다. 첫 번째 함수는 속성을 전달할 때 사용되며 전달할 때 값을 가공할 수 있다. 두 번째 함수는 dispatch을 전달 받아 사용한다. 


## propTypes/defaultProps
prop은 타입과 기본 값을 propTypes와 defaultProps으로 설정할 수 있다.
```js

TODO.propTypes = {
	id: PropTypes.string,
	complete: PropTypes.bool,
	onCreated: PropTypes.func
};

TODO.defaultProps = {
	complete: false
};
```
`propTypes`은 개발 모드에서만 동작하며, 자세한 타입의 종류는 [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation)에서 확인할 수 있다.

# 디버깅 도구
앞에서 middleware을 통해서 간단하게 로깅을 할 수도 있지만, 좀 더 자세히 디버깅을 하고 싶다면 개발자 도구을 사용할 수 있다. 

## 설치 방법
[redux-devtools](https://github.com/gaearon/redux-devtools)을 사용하여 [직접 설정](https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md)해 아래와 같이 사용할 수 있다. 

```js
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
    );
  }

  return store;
}
```
하지만, 설정하기 귀찮다면, [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)을 사용하여 쉽게 디버깅할 수 있다. 먼저 [각 브라우저에 맞는 extension](https://github.com/zalmoxisus/redux-devtools-extension#installation)을 설치하고 아래와 같이 등록한다.
```js
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

export default function configureStore(reducer, initialState = {}) {
	const enhancer = compose(
		applyMiddleware(thunk/* , middleware 추가*/),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	);

	return createStore(reducer, initialState, enhancer);
}

```
> [compose](http://redux.js.org/docs/api/compose.html) 메서드는 뒤에 있는 함수의 반환 결과를 파라메터로 전달하여 사용할 수 있게 하는 메서드이다. 이를 통해서 pipe처럼 통과하기 때문에 모든 행위를 트랙킹하고 값을 저장할 수 있다.

## 간단한 소개
devtools을 사용하면, store변경. action의 실행등 다양한 정보들이 저장되기 때문에 어떻게 store값이 변경이 되었는지, 혹은 어떤 action들이 실행되었는지 실시간으로 확인할 수 있고 이를 되돌리거나 재실행할 수 있다.

이를 디버깅을 하는데 매우 도움이 되면 자주 사용하는 기능 몇 가지를 확인해보자.

### Slider Monitoring
변경된 상태를 보관하기 있기 때문에 어떻게 변경이 되었는지 아래와 같이 slider을 통해 왔다 갔다 할 수 있다.
![image](https://media.oss.navercorp.com/user/244/files/50a11bc6-79a2-11e6-8c8d-fb754ef917a5)

### Diff Monitoring
상태가 어떻게 변경되었는지 확인하는 기능이다. 디버깅할 때 어떤 상태가 언제 변경되었는지 확인할 때 매우 유용한 기능이다.
![image](https://media.oss.navercorp.com/user/244/files/86db47de-79a2-11e6-8667-3dcb4aa016e1)

그외에 다양한 기능은 [redux-devtools](https://github.com/gaearon/redux-devtools)에서 확인할 수 있다.

# 훑어보기
## 빠르게 `redux` 이해하기
`redux`을 사용하면 하나의 `store`을 가지고 있기 때문에 `state`을 변경했을 때 일부분만 바뀌는게 아니라 변경된 새로운 상태를 가진다고 생각해야 한다. 그때, 상태를 변경하는 함수를 `reducer`로 만들게 되는데 `dipatch`마다 이 `reducer`들을 호출하여 상태를 갱신한다. 이 때, 여러 `reducer`을 쉽게 처리하기 위해 만든 함수가 `redux`의 [combineReducers](https://github.com/reactjs/redux/blob/master/src/combineReducers.js#L102-L158)이고 `reducers`을 [이렇게](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/reducer/index.js#L4-L6) 합쳐서 사용한다.

[createStore](https://github.com/reactjs/redux/blob/master/src/createStore.js#L248-L250)는 인자로 `reducers`을 받으며, 여기서는 크게 `subscribe`, `dispatch`을 가지고 있다. `store`은 컴포넌트들에게 [`Provider`](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/index.js#L19)로 전달한다.
[`dispatch`](https://github.com/reactjs/redux/blob/master/src/createStore.js#L170)는 `state`을 변경하기 위해 사용한다. `dispatch`로 들어온 `state`는 `reducer`의 인자로 호출하며 변경된 `state`을 현재 `state로` 변경한다. 그리고 `subscribe`로 등록한 [`listener`을 호출](https://github.com/reactjs/redux/blob/master/src/createStore.js#L109)한다.
> 여기서는 의미상 변경이라고 했지만, 새로 생성된 값이라고 이해하길 바란다.

## 동작 흐름

- 브라우저의 이벤트
- [컴포넌트 이벤트](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/component/todolist/TODOList.js#L36)
- [action creator 호출](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/component/todolist/TODOList.js#L37)
- [store dispatch 호출](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/component/todolist/TODOList.js#L37)
- [reducer들 호출](https://github.com/reactjs/redux/blob/master/src/createStore.js#L170)
	- [todos reducer 호출](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/reducer/todos.js#L29-L40)
- [subscribe한 listener 호출](https://github.com/reactjs/redux/blob/master/src/createStore.js#L178)
	- [render호출하여 View 갱신](https://oss.navercorp.com/au-platform/react-guide/blob/master/src/index.js#L26)

![image](https://media.oss.navercorp.com/user/244/files/c57ddcbc-9f96-11e6-8386-674b279fb755)

작업을 할 때는 위의 흐름을 맞춰서 아래와 같이 좀 더 쉽게 작업할 수 있다.
1. `React 컴포넌트` 만들기 : `하위 React컴포넌트`로 `prop`, `dispatch` 전달
2. `action command/create` 만들기 : `state` 변경, 비동기 처리를 위해 `thunk`을 사용
3. `reducer` 생성 : `store` 구조
4. `dispatch`에 `action결과` 전달

여기까지 `React/Redux`을 사용하여 개발하는 방법에 대해서 알아보았다. 다음으로는 `React`에서 어떻게 이벤트를 처리하고, `DOM`을 렌더링하는지 자세한 방법을 알아보도록 한다.

