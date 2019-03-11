(function($) {
    if (!$) {
        return;
    }

    $(function() {

        var createBurgerMenu = function(row) {

            // create burger container
            var container = document.createElement('DIV');
            var cssclass = document.createAttribute('class');
            cssclass.value = '';
            container.setAttributeNode(cssclass);

            // create anchor icon
            var anchor = document.createElement('A');
            var cssclass = document.createAttribute('class');
            cssclass.value = 'btn cms-icon-menu cms-page-admin-action-btn ' +
                'cms-btn cms-btn-default ' +
                'cms-btn-no-border cms-icon cms-icon-menu closed';
            anchor.setAttributeNode(cssclass);
            var title = document.createAttribute('title');
            title.value = 'Actions';
            anchor.setAttributeNode(title);
            container.appendChild(anchor);
            
            // create options container
            var optionsContainer = document.createElement('DIV');
            cssclass = document.createAttribute('class');

            cssclass.value = 
                // main selector for the menu
                'cms-pagetree-dropdown-menu ' + 
                // keeps the menu arrow in position
                'cms-pagetree-dropdown-menu-arrow-right-top';
            optionsContainer.setAttributeNode(cssclass);
            var ul = document.createElement('UL');
            cssclass = document.createAttribute('class');
            cssclass.value = 'cms-pagetree-dropdown-menu-inner';
            ul.setAttributeNode(cssclass);

            // get the existing actions and move them into the options container
            var li;
            var text;
            let actions = $(row).children('.field-list_actions');
            if (!actions.length) {
                // skip any rows without actions to avoid errors
                return;
            }
            $(actions[0]).children('.cms-page-admin-action-btn').each( function (index, item) {
                li = document.createElement('LI');
                text = document.createTextNode(item.title);
                li.appendChild(item);
                item.appendChild(text);
                ul.appendChild(li);
            })
            optionsContainer.appendChild(ul);
            actions[0].appendChild(container);
            document.body.appendChild(optionsContainer);

            anchor.addEventListener('click', function (ev){
                toggleBurgerMenu(anchor, optionsContainer);
            })
        }


        var toggleBurgerMenu = function(burgerMenuAnchor, optionsContainer) {
            var bm = $(burgerMenuAnchor);
            var op = $(optionsContainer);
            var closed = bm.hasClass('closed');
            $('.cms-pagetree-dropdown-menu').removeClass('open');
            $('.cms-pagetree-dropdown-menu').addClass('closed');
            $('.cms-btn-no-border').removeClass('open');
            $('.cms-btn-no-border').addClass('closed');
            if (closed) {
                bm.removeClass('closed');
                bm.addClass('open');
                op.removeClass('closed');
                op.addClass('open');
            } else {
                bm.addClass('closed');
                bm.removeClass('open');
                op.addClass('closed');
                op.removeClass('open');
            }
            var pos = bm.offset();
            op.css('left', pos.left - 200);
            op.css('top', pos.top);
        }

        
        $('#result_list').find('tr').each( function (index, item) {
            createBurgerMenu(item);
        })


        // it is not possible to put a form inside a form, so
        // actions have to create their own form on click
        $('.js-page-admin-action, .cms-page-admin-js-publish-btn, .cms-page-admin-js-edit-btn')
            .on('click', function(e) {
                e.preventDefault();

                var action = $(e.currentTarget);
                var formMethod = action.attr('class').indexOf('cms-form-get-method') !== -1 ? 'GET': 'POST';
                var csrfToken = formMethod == 'GET' ? '' : '<input type="hidden" name="csrfmiddlewaretoken" value="' +
                            document.cookie.match(/csrftoken=([^;]*);?/)[1] + '">';
                var fakeForm = $(
                    '<form style="display: none" action="' + action.attr('href') + '" method="' +
                           formMethod + '">' + csrfToken +
                    '</form>'
                );
                var keepSideFrame = action.attr('class').indexOf('js-page-admin-keep-sideframe') !== -1;
                // always break out of the sideframe, cause it was never meant to open cms views inside it
                try {
                    if (!keepSideFrame)
                    {
                        window.top.CMS.API.Sideframe.close();
                    }
                } catch (err) {}
                if (keepSideFrame) {
                    var body = window.document.body;
                } else {
                    var body = window.top.document.body;
                }
                fakeForm.appendTo(body).submit();
            });

        $('.js-page-admin-close-sideframe').on('click', function () {
            try {
                window.top.CMS.API.Sideframe.close();
            } catch (e) {}
        });
    });

})((typeof django !== 'undefined' && django.jQuery) || (typeof CMS !== 'undefined' && CMS.$) || false);
