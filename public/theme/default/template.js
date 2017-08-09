import FONT from './styles/font.js';

const displayRobot = (model) => {
    if (!model) {
        return '';
    }

    const parentStatus = model.parentStatus;
    const status = model.status;

    if (parentStatus == 'hidden' || parentStatus == 'private') {
        return `<meta name="ROBOTS" content="NOINDEX, FOLLOW" />`;

    } else if (status == 'private' || status == 'hidden') {
        return `<meta name="ROBOTS" content="NOINDEX, FOLLOW" />`;
    }

    return '';
};

export default ({ body, title, initialState }) => {
    const model = JSON.parse( initialState ).model;
    let font = '';

    FONT.map( ( element )=> {
        font += `<link href="${ element }" rel="stylesheet" />`;
    });

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="description" content="Hello">
        ${ displayRobot( JSON.parse( initialState ).model ) }
        ${font}
        <noscript>
            <div
                style = "position:fixed;width:100%;height:100%;background:white;z-index:200"
            >
                <p
                    style = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family: hind;font-size: 20px; font-weight: 300"
                >
                    <span style = "font-size: 30px">Hello!</span>
                    <br/>
                    <br/>
                    Please enable javascript to view this site.
                </p>
            </div>
        </noscript>
        <link rel="shortcut icon" href="/images/favicon.png"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        <link rel="stylesheet" href="/stylesheets/bootstrap-3.3.7-dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.css" />
        <link rel="stylesheet" href="/theme/default/styles/style.css" />
        <script>window.__APP_INITIAL_STATE__ = ${initialState}</script>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-104311552-1', 'auto');
          ga('send', 'pageview');

        </script>
      </head>
      <body>
        <div id="pollider-public">${body}</div>
      </body>
      <script src="/javascripts/blog.js"></script>
    </html>
    `;
};
