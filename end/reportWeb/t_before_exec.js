function download_img(url) {
    var result = web_request({ 'url': url, 'raw': true });
    if (result.GetType().ToString().Contains("Exception"))
        return { 'errcode': -1, 'message': result.Message };
    var content_type = result.response.Content.Headers['ContentType']['MediaType'];
    if (content_type.StartsWith('image/'))
        return { 'data': result.content, 'type': content_type };
    else
        return { 'errcode': -1, 'message': "不是图片类型：" + content_type };
}
return { download_img };