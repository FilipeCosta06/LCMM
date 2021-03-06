import {Button, Card, Icon, Image, Label,Form, Message,Segment} from "semantic-ui-react";
import React, {useContext, useEffect, useState} from "react";
import {store} from "../StateProvider/StateProvider";
import {CONFIG_COOKIE, CONFIG_DISPATCH_ACTIONS, CONFIG_FRONTEND, HOST} from "../../config";
import MyPlaceholderImage from "../../assets/img/placeholder.png";
import {Link, useHistory} from "react-router-dom";
import * as APIHandler from '../../api/apiHandler'
import {tryVerifyPlugin} from "../../api/apiHandler";



export default function Plugin() {
    const {state,dispatch} = useContext(store);
    const history = useHistory();

    const addToCart = (_id) => {
        if (!state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY]){
            history.push(CONFIG_FRONTEND.URL_LOGIN)
        } else {
            APIHandler.tryAddToCart({
                token: state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY],
                pluginId: _id
            })
                .then(response => {
                    history.push(CONFIG_FRONTEND.URL_CART);
                })
                .catch(error => {
                    return <Message error>Something went wrong</Message>
                })
                .finally(() => dispatch({type: CONFIG_DISPATCH_ACTIONS.HIDE_LOADING}));
        }
    }

    let urlParamPluginId = window.location.search.split("plugin=")
        ? window.location.search.split("plugin=")[1]
        : null;
    const plugin = state.pluginsById[urlParamPluginId];
    const [comments, setComments] = useState(plugin ? plugin.comments : []);
    const [currentComment, setCurrentComment] = useState("");
    const [likeState, setlikeState] = useState({
        
        like: (state[CONFIG_COOKIE.USER_INFOS_KEY] && state[CONFIG_COOKIE.USER_INFOS_KEY].pluginLiked && state[CONFIG_COOKIE.USER_INFOS_KEY].pluginLiked.indexOf(plugin._id) !== -1),
        pluginId : plugin ? plugin._id : null
    });
    /*
    useEffect(() => {
        APIHandler.tryGetUserInfo({
        token : state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY]
    })
        .then(response => response.pluginLiked.map((like)=>{
            if(like === plugin._id ){
                setlikeState({
                    like : true
                })
                return ;
            }
            })
        )
      .catch(console.error); // histoire de pas péter l'App sur une vieille erreur
    },[]); //*/

    useEffect(() => {
        setComments(plugin ? plugin.comments : []);
        setlikeState({
            like: (state[CONFIG_COOKIE.USER_INFOS_KEY] && state[CONFIG_COOKIE.USER_INFOS_KEY].pluginLiked && state[CONFIG_COOKIE.USER_INFOS_KEY].pluginLiked.filter((pId) => pId === plugin._id))
        })
    }, [state.pluginsById]);


    let onSubmitHandler = function(e) {
        if (!state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY]) {
            alert("You must be connected to leave a message");
            return false;
        }

        if (!currentComment)
            return false;

        e.preventDefault();
        APIHandler.trySendComment({
            token : state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY],
            value: currentComment,
            pluginId : plugin._id
        })
            .then(response => {
                setComments(response.comments);
                setCurrentComment("")
            })
            .catch(console.error)
    }

    if (!plugin)
        return <Message error>Something went wrong</Message>;

    const verifyClickHandler = () => {
        if (!plugin)
            return;
            console.log(plugin.isVerified)
            APIHandler[plugin.isVerified ? "tryUnverifyPlugin": "tryVerifyPlugin"]({
                token: state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY],
                pluginId: plugin._id
            })
                .then(console.log)
                .catch(console.error)
    };

    return (
        <React.Fragment>
            <Card style={{
                width: '100%'
            }}>
                <Card.Content>
                    <Card.Header>{plugin.name}</Card.Header>
                    <Card.Meta>
                        <span className="left floated">
                            v.{plugin.version}&nbsp;-&nbsp;
                            <span
                                style={{
                                    color: 'green'
                                }}>
                                {plugin.price || "0.00"}€
                            </span>
                        </span>
                        <span className="right floated">
                            <a>
                                {plugin.user}
                                <Icon name='user'/>
                            </a>
                        </span>
                    </Card.Meta>

                    <Card.Description
                        style={{
                            textAlign: 'justify'
                        }}>
                        {plugin.description}
                    </Card.Description>
                </Card.Content>

                <Image
                    src={HOST + '/' + plugin.pluginImage.substring(8)}
                    height={200}
                    className='no-radius'
                    centered
                    onError={i => i.target.src = MyPlaceholderImage} />

                <Card.Content extra>
                    <span className="left floated">
                    {
                        (!!plugin.tags && !!plugin.tags.length) &&
                        plugin.tags.map(t => {
                            if (t)
                                return <Label tag style={{ marginBottom: "2px"}} size='small' as='a'>
                                    {t}
                                </Label>
                        })
                    }
                    </span>
                    <span
                        className={"right floated " + (likeState.like ? "active" : "")}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            
                            console.log(likeState.like)
                            if(likeState.like === true || likeState.like){
                                APIHandler.tryUnLikePlugin(
                                    {token : state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY],
                                        pluginId : plugin._id}
                                    
                                )
                                e.target.classList.toggle("outline");
                                setlikeState({
                                    like : false
                                })
                                plugin.likes--
                            }else{
                                setlikeState({
                                    like : true
                                })
                                APIHandler.tryLikePlugin(
                                    {token : state[CONFIG_COOKIE.USER_AUTH_TOKEN_KEY],
                                    pluginId : plugin._id}
                                )
                                plugin.likes++
                                e.target.classList.toggle("active");
                            }
                            console.log("// todo submit Like/Unlike");
                        }}>
                      <i className="heart outline like icon"/>
                        {plugin.likes}
                    </span>
                </Card.Content>

                <Card.Content>
                    <div className='ui three buttons'>
                        {
                            plugin.isVerified &&
                            <Button basic color='orange'
                                onClick={() => addToCart(plugin._id)}>
                            <Icon name='cart plus'/>
                            Cart
                        </Button>
                        }

                        <Button basic color='blue'
                                as={Link}
                                to={CONFIG_FRONTEND.URL_PLAY_PLUGIN + "?plugin=" + plugin._id}>
                            <Icon name='play'/>
                            Test
                        </Button>

                        {
                            state[CONFIG_COOKIE.USER_INFOS_KEY] && state[CONFIG_COOKIE.USER_INFOS_KEY].isAdmin &&
                            <Button
                                basic
                                color={plugin.isVerified ? 'red' : 'green'}
                                onClick={() => {
                                    // todo submit un/verify plugin
                                    console.log("todo submit un/verify plugin");
                                    verifyClickHandler();
                                }}>
                                <Icon name={plugin.isVerified ?  'lock' : 'unlock'}/>
                                {plugin.isVerified ? 'Unverify' : 'Verify'}
                            </Button>
                        }
                    </div>

                </Card.Content>
            </Card>


            <div style={{textAlign: 'left'}}>
                <div className="ui comments">
                    <h3 className="ui dividing header" style={{textAlign: 'center'}}>Comments</h3>
                    {comments.map((comment) => (
                        <div className="comment">
                            <div className="content">
                                <a className="author">{comment.author}</a>
                                <div className="metadata" style={{float: 'right'}}>
                                    <span className="date">{comment.posted}</span>
                                </div>
                                <div className="text">
                                    {comment.value}
                                </div>
                            </div>
                        </div>))}
                    <Form size='massive' className="ui reply form" onSubmit={onSubmitHandler}>
                        <div className="field">
                            <Segment stacked>
                                <Form.Input
                                    required
                                    fluid
                                    icon='comment'
                                    type='comment'
                                    name='comment'
                                    iconPosition='left'
                                    placeholder='Leave a comment here'
                                    value={currentComment}
                                    onChange={(e, {value}) => setCurrentComment(value)}/>
                                <Button color='blue' fluid size='large'>
                                    Add Comment
                                </Button>
                            </Segment>
                        </div>
                    </Form>
                </div>
            </div>
        </React.Fragment>
    )
}
