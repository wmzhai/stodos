Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');


Router.configure({
    layoutTemplate : 'main'
});


Router.route('/register');
Router.route('/login');
Router.route('/',function(){
   this.render('home');
},{
        name: 'home'
});


Router.route('/list/:_id', function(){
    this.render('listPage', {
       data : function(){
           var currentList = this.params._id;
           return Lists.findOne(currentList);
       }
    });
},{
    name : 'listPage'
});


if(Meteor.isClient){

    Template.navigation.events({
       'click .logout' : function(event){
           event.preventDefault();
           Meteor.logout();
           Router.go('login');
       }
    });

    Template.register.events({
        'submit form' : function(){
            event.preventDefault();
            var email = event.target.email.value;
            var password = event.target.password.value;

            Accounts.createUser({
                email : email,
                password : password
            },function(error){
                if(error){
                    console.log(error.reason);
                }else{
                    Router.go('home');
                }
            });
        }
    });

    Template.login.events({
        'submit form': function(event){
            event.preventDefault();
            var email = event.target.email.value;
            var password = event.target.password.value;

            Meteor.loginWithPassword(email,password,function(error){
                if(error){
                    console.log(error.reason);
                }else{
                    Router.go('home');
                }
            });
        }
    });

    Template.todosList.helpers({
        'todo': function(){
            var currentList = this._id;
            return Todos.find({listId: currentList}, {sort: {createdAt: -1}})
        }
    });

    Template.addTodo.events({
        'submit form' : function(event){
            event.preventDefault();
            var todoValue = event.target.todoValue.value;
            var currentList = this._id;
            Todos.insert({
                title: todoValue,
                completed: false,
                createAt : new Date(),
                listId : currentList
            });
            event.target.todoValue.value = "";
        }
    });

    Template.todoItem.events({
        'click .delete-todo' : function(event){
            event.preventDefault();
            var confirm = window.confirm('delete this task?');
            if( confirm){
                var documentId = this._id;
                Todos.remove({_id: documentId});
            }
        },
        'keyup .todo-value': function(event){
            if(event.which == 13 || event.which == 27){
                event.target.blur();
            } else {
                var todoValue = event.target.value;
                var documentId = this._id;
                Todos.update({_id: documentId}, {$set: {title: todoValue}});
            }
        },
        'change [type=checkbox]' : function(){
            console.log("You checked or unchecked this checkbox");
            var isCompleted = this.completed;
            if( isCompleted){
                Todos.update({_id : this._id},{$set :{completed : false}});
                console.log("Task marked as incomplete.");
            }else{
                Todos.update({_id : this._id},{$set :{completed: true}});
                console.log("Task marked as complte.");
            }
        }
    });

    Template.todoItem.helpers({
        'checked': function(){
            var isCompleted = this.completed;
            if(isCompleted){
                return "checked";
            } else {
                return "";
            }
        }
    });

    Template.todosCount.helpers({
        'totalTodos': function(){
            var currentList = this._id;
            return Todos.find({listId: currentList}).count();
        },
        'completedTodos': function(){
            var currentList = this._id;
            return Todos.find({listId: currentList, completed: true}).count();
        }
    });


    Template.addList.events({
        'submit form': function(event){
            event.preventDefault();
            var listName = event.target.listName.value;
            Lists.insert({
                name: listName
            },function(error, document){
                console.log(document);
                Router.go('listPage',{_id:document});
            });
            event.target.listName.value = "";
        }
    });

    Template.lists.helpers({
        'list': function(){
            return Lists.find({}, {sort: {name: 1}})
        }
    });

}



if(Meteor.isServer){


}