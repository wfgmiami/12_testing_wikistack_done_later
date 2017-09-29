var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var Page = require('../models').Page;
var User = require('../models').User;
var expect = require('chai').expect;

xdescribe('routes', function(){

  beforeEach(function(){
    return Page.sync({ force: true })
  })

  beforeEach(function(){
    return User.sync({ force: true })
  })

  beforeEach(function(){
    page = Page.build()
    page.title = "new story"
    page.content = "this is content"
    page.save()
  })

  describe('get /wiki/', function(){
    it('gets 200', function(){
      return agent
      .get('/wiki')
      .expect(200)
    })
  })

  describe('get /wiki/add', function(){
    it('gets 200', function(done){
     agent
      .get('/wiki/add')
      .expect(200, done)
    })
  })

  describe('get /wiki/:urlTitle', function(){
    it('gets 200', function(done){
      agent
      .get('/wiki/new_story')
      .expect(200, done)
    })
  })

  describe('post /wiki/', function(){
    it('gets 200', function(){
     return agent
      .post('/wiki')
      .send( {
        authorEmail: 'Alex@yahoo.com',
        authorName: 'al',
        title: 'my story',
        content: 'content text here',
        status: 'open',
        tags: 'story telling'
      })
      .then( () => {
        return Page.findAll();
      })
      .then( pages => {
        var possiblePage = pages[1];

        expect(possiblePage.title).to.be.equal('my story')
        expect(possiblePage.status).to.be.equal('open')
        expect(possiblePage.id).to.be.equal(2)

      })

    })
  })


})
