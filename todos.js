Todos = new Meteor.Collection('todos');

if(Meteor.isClient){
    Template.todosList.helpers({
       'todo' : function(){
           return Todos.find({},{sort:{createdAt: -1}});
       }
    });

    Template.addTodo.events({
        'submit form' : function(event){
            event.preventDefault();
            var todoValue = event.target.todoValue.value;
            Todos.insert({
                title: todoValue,
                completed: false,
                createAt : new Date()
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
            event.preventDefault();
            var todoValue = event.target.value;
            var documentId = this._id;
            Todos.update({_id: documentId},{$set: {title: todoValue}});
        }
    });
}



if(Meteor.isServer){


}