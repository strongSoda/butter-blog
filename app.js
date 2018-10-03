var express = require('express');
var butter = require('buttercms')('1f289135f7c46e235ad2c9923f1b6426d7d5c9a3');
var engine = require('ejs-locals');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));



app.listen(process.env.PORT || 5000);

function renderHome(req, res) {
  var page = req.params.page || 1;

  butter.post.list({page_size: 10, page: page}).then(function(resp) {
    res.render('index', {
      posts: resp.data.data,
      next_page: resp.data.meta.next_page,
      previous_page: resp.data.meta.previous_page
    })
  })
}

app.get('/blog/:slug', renderPost)

function renderPost(req, res) {
  var slug = req.params.slug;

  butter.post.retrieve(slug).then(function(resp) {
    res.render('post', {
      title: resp.data.data.title,
      post: resp.data.data,
      published: new Date(resp.data.data.published)
    })
  })
}

app.get('/category/:slug', renderCategory)

function renderCategory(req, res) {
  var slug = req.params.slug;

  butter.category.retrieve(slug, {include: 'recent_posts'})
    .then(function(resp) {
      res.render('category', {
        title: resp.data.data.name,
        category: resp.data.data
      })
    })
}

app.get('/rss', function(req, res) {
    res.set('Content-Type', 'text/xml');
  
    butter.feed.retrieve('rss').then(function(resp) {
      res.send(resp.data.data)
    })
  });
  
  app.get('/atom', function(req, res) {
    res.set('Content-Type', 'text/xml');
  
    butter.feed.retrieve('atom').then(function(resp) {
      res.send(resp.data.data)
    })
  });
  
  app.get('/sitemap', function(req, res) {
    res.set('Content-Type', 'text/xml');
  
    butter.feed.retrieve('sitemap').then(function(resp) {
      res.send(resp.data.data)
    })
  });
