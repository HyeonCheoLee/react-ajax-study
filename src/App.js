import React, {Component} from "react"; //react에서 Component를 사용하려면 {Component} 임포트 해야한다. 

class Nav extends Component{


  render(){
    let listTag = [];

    this.props.list.forEach(item=>{
      listTag.push(<li key={item.id}>
        <a href={item.id} data-id={item.id} onClick={function(e){
          e.preventDefault();
          this.props.onClick(e.target.dataset.id);
        }.bind(this)}>{item.title}</a>
        </li>)
    })

    return(
      <nav>
        <ul>
          {listTag}
        </ul>
      </nav>
    );
  }
}

class Article extends Component{
  render(){
    return(
      <article>
        <h2>{this.props.title}</h2>
        {this.props.desc}
      </article>
    )
  }
}

class NowLoading extends Component{
  render(){
    return (
      <div>Now Loading...</div>
    )
  }
}

//렌더링 : 최신 데이터와 함께 변경해야할 컴포넌트를 화면이 그려준다.
class App extends Component {
  //함수형 컴포넌트에서는 useState를 사용하여 state를 사용하지만
  //클래스형 컴포넌트에서는  state로 작성한다. 클래스형 컴포넌트의 생성자 메서드인 constructor(props) 메서드로 선언할수도 있지만 이경우에는 super(props)를 호출해야한다.
  //아래는 다른방법으로 state의 초기값을 설정
  state = {
    article:{item:{title:'Welcome', desc:'Hello, React and Ajax'},
             isLoading:false},
    list:{
      items:[],
      isLoading:false
    }
  }

  componentDidMount(){  //컴포넌트가 애플리케이션에 탑재되는 시점 마운트되는 시점에 작동
    let newList = Object.assign({}, this.state.list, {isLoading:true});
    this.setState({list:newList})
    fetch('list.json')
    .then(function(result){
      return result.json(); //웹브라우저가 가져온 텍스트 파일을 json타입으로 컨버팅하여 리턴한다.
    })
    .then(function(json){
      this.setState({list:{
        items:json,
        isLoading:false
      }}); //json으로 넘겨받은 데이터를 state설정
    }.bind(this)) //this.가 동작하기 위해서는 함수가 호출될때 내부로 바꿔줘야한다. 따라서 . bind()를 사용한다.
  }

  render(){
    let navTag = null;  //화면 렌더링 되는 시점에 어떻게 보여줘야될지 보여줘야하므로 render 함수 안에서 실행한다.
    let articleTag = null;
    if(this.state.list.isLoading){
      navTag = <NowLoading></NowLoading>
    }else{
      navTag = <Nav list={this.state.list.items} onClick={
        function(id){
          let newLoading = Object.assign({}, this.state.article, {isLoading:true});
          this.setState({article:{isLoading:newLoading}})
          fetch(id + '.json')
          .then(function(result){
            return result.json();
          })
          .then(function(json){
            this.setState({
              article:{
                item:{
                  title:json.title,
                  desc:json.desc
                },
                isLoading:false
              }
            })
          }.bind(this))
        }.bind(this)
      }></Nav>
    }

    if(this.state.article.isLoading){
      articleTag = <NowLoading></NowLoading>
    }else{
      articleTag = <Article title={this.state.article.item.title} desc={this.state.article.item.desc}></Article>
    }
    return (
      <div className="App">
        <h1>WEB</h1>
        {navTag}
        {articleTag}
      </div>
    );
  }
}

export default App;
