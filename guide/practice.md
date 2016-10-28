# React/Redux 프로젝트의 practice
프로젝트에 `React/Redux`를 적용할 때 미리 알고 있으면 좋을만한 practice을 정리한다. 만약에 기본적인 `React의 사용법을 다루지 않기 때문에 `React`의 사용법을 학습해야 한다.

## 시작하기
`React`을 사용하기 위해 설정해야 하는 도구들이 많다. 그래서 직접 설정하는 방법도 있지만, [`React Starter Kit`](https://www.reactstarterkit.com/)등 다양한 scaffold 도구를 사용한다. 여기서는 `facebook`에서 만든 [`create-react-app`](https://github.com/facebookincubator/create-react-app) 도구를 사용한다. `create-react-app`을 사용한 이유는 `react`을 개발하는 `facebook`이 만들었고, 다른 도구에 비해서 기능을 작지만, 쉽고 편하게 쓸 수 있다. 만약에 `server rendering`등 다양한 기능을 사용하고 싶다면, `React Starter Kit`도 좋은 선택이 될 수 있다.

### 설치하기
```
npm install -g create-react-app //설치

create-react-app my-app // project 생성
cd my-app // 이동
```

### command
```
npm start // 시작(자동 브라우저 실행)
npm run build // production mode로 파일 빌드해서 build폴더에 생성
```

해당 저장소는 `create-react-app`을 사용하여 만들어져 있습니다.

## 폴더 구조

여기서는 단순히 `react`을 사용하는 프로젝트 보다는 일반적으로 프로젝트에서 redux을 많이 사용하기 때문에 [redux-book](http://redux.js.org/docs/advanced/ExampleRedditAPI.html)의 폴더 구조를 기준으로 작성했다. 여기서 말한 폴더 구조는 제안하는 방법으로 자신의 프로젝트에 맞게 변경하면 된다.

![image](https://media.oss.navercorp.com/user/244/files/75c96e76-7420-11e6-9d3a-b50ec1fa0cc1)

위의 그림에서 보듯이 크게 `action`, `component`, `reducer`, `store`로 구분되어 있다.

### action
`action`폴더는 사용하는 명령어와 API통신등의 작업을 하는 `action메서드`들로 구성된 파일이다. 어떤 서비스의 경우에는 모든 command와 action을 한곳에 모아두기도 하고, 각 도메인 별로 구분하기도 한다.
API와 같이 비동기 통신이 필요한 경우는 뒤(#비동기_처리)에서 다룰 [react-thunk](https://github.com/gaearon/redux-thunk), [react-saga](https://github.com/barbuza/react-saga)을 사용해야 하기 때문에 간단한 예제를 작성한다.

![image](https://media.oss.navercorp.com/user/244/files/9ff473ce-9d30-11e6-8d8c-4ded3cb8f79d)

**[action/todo.js]**
```js
// action type
export const ADD_TODO = 'ADD_TODO'


// action creators
export function addTodo(text) {
  return { type: ADD_TODO,  text};
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


const todolistStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const todolistDispatchToProps = (dispatch) => { // Container에서 Presentational으로 전달
    return {
        onClick(data){
          dispatch(complete(data))
        }
    }
}
export default connect(todolistStateToProps,todolistDispatchToProps)(TODOList);
```

**Presentational Component(component/todolist/TODO.js)**
```js
class TODO extends Component {
  render() {
  	const {id, todo, complete, onClick} = this.props; // Container에서 연결된 prop 사용
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
해당 폴더에는 `index.js`하나만 있으며 주로 하는 미들웨어를 설정하는 일을 한다. 예를 들어 비동기 통신을 사용하기 위에 `redux-thunk`을 [설정](#Middleware)하거나, 히스토리 관리를 하기 위해 router을 설정하거나, 디버깅을 위해 [react-devtool](#디버깅_도구)을 설정하는 일을 주로 한다.

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


## Middleware

미들웨어는 간단하게 보면 `dispatch` 전/후에 원하는 작업을 할 수 있다. 예를 들어, `dispatch`전에 전/후를 `state`의 변화를 알 수 있거나, 비동기 통신의 경우 `callback`에서 `dispatch`을 할 수 있다. 좀 더 자세한 내용은 링크를 참고하길 바란다. [링크](https://dobbit.github.io/redux/docs_kr/advanced/Middleware.html)

이중 많이 사용하는 미들웨어의 활용의 예를 알아본다.

### 비동기 처리
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
아래와 같이 dispatch을 인자로 받는 함수를 만들고 응답이 온 후 dispatch을 호출하면 정상적으로 비동기 통신을 적용할 수 있다.
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

이렇게 `middleware`을 사용하여 `dispatch전/후`로 관련한 작업을 사용할 수 있다. 하지만 로깅의 경우 위와 같이 `redux-logger`을 사용하기도 하지만 일반적으로는 [디버깅 도구](#디버깅_도구) 사용하여 디버깅하기 때문에 참고만 하길 바란다.

## state/prop의 구분

## 디버깅 도구