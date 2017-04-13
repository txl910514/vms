/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../../utils';
import Base from '../base';

const Article = new Base('Article', {
  user:      { type: Base.ObjectId(), ref: 'User' },
  headerImg: String,
  title:     String,
  content:   String,
  markdown:  String,
  html:      String,
  status:    String,
  job:       {},
  sendAt:    { type: Date, default: Date.now },
  likes:     { type: Array, default: [] },
  _index:    { type: Number, default: 0, index: true }
});

const validateSchema = $.paramter.object().keys({
  title:     $.paramter.string(),
  user:      $.paramter.string(),
  content:   $.paramter.string().empty(''),
  markdown:  $.paramter.string().empty(''),
  html:      $.paramter.string().empty(''),
  subTitle:  $.paramter.string().empty(''),
  headerImg: $.paramter.string().empty(''),
  status:    $.paramter.string(),
  sendAt:    $.paramter.date().empty(''),
})
.with('title', 'user')
.without('headerImg', 'subTitle', 'sendAt', 'html', 'markdown', 'content'); // optional

Article.methods.create = async function (query) {
  const { error, value } = $.paramter.validate(query, validateSchema);
  $.debug(error);
  if (error) return -1;
  query._index = await this.count({}) + 1;
  return await Article.create(query);
}



export default Article.methods


