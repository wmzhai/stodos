Todos = new Meteor.Collection('todos');

if(Meteor.isClient){
    Template.todosList.helpers({
       'todo' : function(){
           return Todos.find({});
       }
    });
}



if(Meteor.isServer){


}