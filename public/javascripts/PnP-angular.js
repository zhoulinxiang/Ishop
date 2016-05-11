/*
 * 后台数据脚本
 *
 */

$( function ( ) {
    // 全选
   $( ':checkbox' ).prop( 'checked', false );

   $( '#targetIds' ).val( '' );

   $( '#selectAll' ).click( function ( ) {
       if ( $( this ).prop( 'checked' ) ) {
           $( '.datalist > td > input[name=listItem]' ).prop( 'checked', true );
       } else {
           $( '.datalist > td > input[name=listItem]' ).prop( 'checked', false );
       }
       getSelectIds();
   });

});

// 获取选中的条目ID
function getSelectIds(){
    var checkBoxList = $( ".datalist td input[name='listItem']:checkbox" );
    var ids = '';
    if ( checkBoxList.length > 0 ) {
        $( checkBoxList ).each( function ( i ) {
            if ( true == $( this ).prop( "checked" ) ) {
                ids += $( this ).prop( 'value' ) + ',';
            }
        });
        // 去掉结尾的','
        $( '#targetIds' ).val( ids.substring( 0, ids.length - 1 ) );
    }
}




//初始化分页
function initPagination ( $scope, $http, currentPage, searchKey ) {

    $( "#dataLoading" ).removeClass( "hide" );
    $scope.selectPage = [
        { name:'10', value : '10'  },
        { name:'20', value : '20' },
        { name:'30', value : '30' }
    ];

    $scope.limitNum = '10';
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.totalItems = 0;
    $scope.limit = 10;
    $scope.pages = [];
    $scope.startNum = 1;
    $scope.keywords = searchKey;
    getPageInfos( $scope, $http, "/admin/api/v1/" + currentPage );
}


// 翻页组件
function getPageInfos( $scope, $http, url ) {

    // 定义翻页动作
    $scope.loadPage = function ( page ) {
        $scope.currentPage = page;
        getPageInfos( $scope, $http, url );
    };

    $scope.nextPage = function () {
        if ( $scope.currentPage < $scope.totalPage ) {
            $scope.currentPage++;
            getPageInfos( $scope, $http, url );
        }
    };

    $scope.prevPage = function () {
        if ( $scope.currentPage > 1 ) {
            $scope.currentPage--;
            getPageInfos( $scope, $http, url );
        }
    };

    $scope.changeOption = function(){

        $scope.limit = Number( $scope.limitNum );
        getPageInfos( $scope, $http, url );
    };

    $http.get( url + "?limit=" + $scope.limit + "&currentPage=" + $scope.currentPage + "&searchKey=" + $scope.keywords )
        .success( function ( result ) {
            // console.log("getData success!");
            $scope.data = result.docs;
            if ( result.pageInfo ) {
                $scope.totalItems = result.pageInfo.totalItems;
                $scope.currentPage = result.pageInfo.currentPage;
                $scope.limit = result.pageInfo.limit;
                $scope.startNum = result.pageInfo.startNum;
                //获取总页数
                $scope.totalPage = Math.ceil( $scope.totalItems / $scope.limit );
                //生成数字链接
                var pageNum =  Number( $scope.currentPage );
                if ( $scope.currentPage > 1 && $scope.currentPage < $scope.totalPage ) {
                    $scope.pages = [
                        $scope.currentPage - 1,
                        $scope.currentPage,
                        $scope.currentPage + 1
                    ];
                } else if ( $scope.currentPage == 1 && $scope.totalPage == 1 ) {
                    $scope.pages = [
                        $scope.currentPage
                    ];
                } else if ( $scope.currentPage == 1 && $scope.totalPage > 1 ) {
                    $scope.pages = [
                        $scope.currentPage,
                        $scope.currentPage + 1
                    ];
                } else if ( $scope.currentPage == $scope.totalPage && $scope.totalPage > 1 ) {
                    $scope.pages = [
                        $scope.currentPage - 1,
                        $scope.currentPage
                    ];
                }
            } else {
                console.error("get pagination info failed.")
            }

            $("#dataLoading").addClass("hide");
        });
}




//angularJs https Post方法封装
function angularHttp( $http, isValid, method, url, formData, callback ) {
    if ( isValid ) {
        $http({
            method  : method,
            url     : url,
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success( function ( data ) {
                // 关闭所有模态窗口
                $( '.modal' ).each( function ( i ) {
                    $( this ).modal( "hide" );
                });
                if ( data == 'success' ) {
                    callback && callback( data );
                }else{
                    showErrorInfo( data );
                }
        });
    } else {
        console.error("parameters is invalid.");
    }
}


// 主要针对删除操作
function angularHttpDelete( $http, url, callback ) {
    $http.delete( url ).success( function ( result ) {
        $( '.modal' ).each( function ( i ) {
            $( this ).modal( "hide" );
        });
        if ( result === 'success' ) {
            callback( result );
        } else {
            showErrorInfo( result );
        }
    });
}

// 错误信息
function showErrorInfo( info ) {
    $( '#error-info' ).removeClass( 'hide' ).css( 'opacity', 1 ).html( "<i class='icon fa fa-warning'></i>&nbsp" + info );
    setTimeout( function () {
        $( '#error-info' ).animate({
            'opacity': 0
        }, 1000, function () {
            $('#error-info').addClass('hide');
        });
    }, 5000);
}

// 提示用户操作窗口
function initCheckIfDo( $scope, targetId, msg, callback ){
    $( '#checkIfDo' ).on( 'show.bs.modal', function ( event ) {
        if ( targetId ) {
            $scope.targetID = targetId;
        }
        $( this ).find( '.modal-msg' ).text( msg );
    }).on( 'hide.bs.modal', function ( event ) {
        $scope.targetID = "";
    });
    $( '#checkIfDo' ).modal( 'show' );
    // 确认执行删除
    $scope.confirmDo = function (currentID) {
        callback( currentID );
        $( '#checkIfDo' ).modal( 'hide' );
    };
}


// 初始化删除操作
function initDelOption( $scope, $http, currentPage, searchKey, info ) {
    // 单条记录删除
    $scope.delOneItem = function ( id ) {
        initCheckIfDo( $scope, id, info, function ( currentID ) {
            angularHttpDelete( $http, "/admin/api/v1/" + currentPage + "/" + currentID, function ( ) {
                initPagination( $scope, $http, currentPage, searchKey );
            });
        });
    };

    $scope.getNewIds = function(){
        getSelectIds();
    };

    // 批量删除
    $scope.batchDel = function ( ) {
        var targetIds = $( '#targetIds' ).val();
        if ( targetIds && targetIds.split(',').length > 0 ) {
            initCheckIfDo( $scope, $('#targetIds').val(), info, function ( currentID ) {
                var ida = currentID.split(',');
                for ( var i = 0; i < ida.length; i++ ) {
                    angularHttpDelete( $http, "/admin/api/v1/" + currentPage + "/" + ida[i], function ( ) {
                        initPagination( $scope, $http, currentPage, searchKey );
                    });
                }
            });
        } else {
            alert('Please choose one at least.');
        }
    }

}

