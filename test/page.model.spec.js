const expect = require('chai').expect;
const Page = require('../models').Page;

describe('Page model',()=>{
  var alPage, jPage, tPage;
  beforeEach('creating Page table', function(){
    return Page.sync( { force: true })
  })

  beforeEach('putting data in DB', function(done){

    var alexPage = Page.create({
      title: 'alex story',
      content: 'once upon a time',
      tags: ['time', 'once']
    })

    var tomPage = Page.create({
      title: 'tom story',
      content: 'one truck at a time',
      tags: ['time', 'truck']
    })

    var johnPage = Page.create({
      title: 'john story',
      content: 'sma once a day',
      tags: ['sma', 'day']
    })

    Promise.all([ alexPage, tomPage, johnPage ])
    .then( pages => {
      alPage = pages[0];
      tPage = pages[1];
      jPage = pages[2];
      done();
    })
    .catch( done )
  })


  it('exists',()=>{
    expect(Page).to.be.an('function')
  })

  describe('virtuals', function(){
    var page = Page.build();
    it('should return route', function(done){
      page.urlTitle="my_story";
      expect(page.route).to.be.equal("/wiki/my_story");
      done();
    })
  })

  describe('renderedContent', function(){
    var page = Page.build();
    it('should return marked content', function(){
      page.content = '# trucking story';
      var markedContent = require('marked')(page.content);

      expect(page.renderedContent).to.be.equal(markedContent)
    })
  })

  describe('hooks', function(){
    describe('before validate', function(){
      it('inserts _ in for urlTitle', function(){
        return Page.create({
          title: "my shorter story",
          content: "hello"
        })
        .then( page => {
          return page.validate()
        })
        .then( (page) => {
          expect(page.urlTitle).to.be.equal("my_shorter_story");
          //done();
        })

      })
    })
  })

  describe('class methods', function(done){
    it('finds a given page by tag', function(done){
      var timeTag, smaTag;

      var findingTime = Page.findByTag('time');
      var findingSma = Page.findByTag('sma');

      Promise.all([ findingTime, findingSma ])
      .then( tagPages => {
          timeTag = tagPages[0];
          smaTag = tagPages[1];
          expect(timeTag).to.have.lengthOf(2);
          expect(smaTag).to.have.lengthOf(1);
          done();
      })
      .catch( done )
    })

  })

  describe('instance methods', function(){
    it('finds similar pages', function(done){
      alPage.findSimilar()
      .then( similarPages => {
        expect( similarPages ).to.have.lengthOf(1);
        done();
      })
      .catch(done)
    })
  })

  describe('validation errors', function(){
    var page = Page.build();

    it('gives validation error', function(done){

      page.title = 'my test title'
      page.validate()
      .catch( (err) => {
        expect(err).to.exist;
        expect(err.errors).to.exist;
        expect(err.errors[0].path).to.equal('content');
        done()
      })
    })

    it('gives error on wrong data', function(done){
      page.content = "some content"
      page.status = "bubble fights";
      page.save()
      .then( () => {
        done(new Error("save happened successfully :("))
      })
      .catch( err => {
        expect(err.message.search('enum')).to.be.greaterThan(-1);
        done();
      })
    })

  })

})
