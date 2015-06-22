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
}



if(Meteor.isServer){


}