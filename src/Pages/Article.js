import React, { Component } from 'react';
import dateFormat from 'dateformat';

import { ArticleStore } from '../Stores/Article';
import RichTextElement from '../Components/RichTextElement';
import { dateFormats } from '../Utilities/LanguageCodes';
import Metadata from '../Components/Metadata';
import { translate } from 'react-translate';

let getState = props => {
  return {
    article: ArticleStore.getArticle(
      props.match.params.articleId,
      props.language
    ),
    linkedItems:  ArticleStore.getArticleLinkedItems(props.language)
  };
};

class Article extends Component {
  constructor(props) {
    super(props);

    this.state = getState(props);
    this.onChange = this.onChange.bind(this);
    dateFormat.i18n = dateFormats[props.language] || dateFormats[0];
  }

  componentDidMount() {
    ArticleStore.addChangeListener(this.onChange);
    ArticleStore.provideArticle(
      this.props.match.params.articleId,
      this.props.language
    );
  }

  componentWillUnmount() {
    ArticleStore.removeChangeListener(this.onChange);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.language !== nextProps.language) {
      ArticleStore.provideArticle(
        nextProps.match.params.articleId,
        nextProps.language
      );
      dateFormat.i18n = dateFormats[nextProps.language] || dateFormats[0];

      return {
        language: nextProps.language
      };
    }
    return null;
  }

  onChange() {
    this.setState(getState(this.props));
  }

  render() {
    let article = this.state.article;

    if (!article) {
      return <div className="container" />;
    }

    let formatDate = value => {
      return dateFormat(value, 'dddd, mmmm d, yyyy');
    };

    let title =
      article.elements.title.value.trim().length > 0
        ? article.elements.title.value
        : this.props.t('noTitleValue');

    let imageLink =
      article.elements.teaserImage.value[0] !== undefined ? (
        <img
          alt={title}
          className="img-responsive"
          src={article.elements.teaserImage.value[0].url}
          title={title}
        />
      ) : (
        <div className="img-responsive placeholder-tile-image">
          {this.props.t('noTeaserValue')}
        </div>
      );

    let postDate = formatDate(article.elements.postDate.value);

    let bodyCopyElement =
      article.elements.bodyCopy.value !== '<p><br></p>' ? (
        <RichTextElement
          className="article-detail-content"
          element={article.elements.bodyCopy}
          linkedItems={this.state.linkedItems}
        />
      ) : (
        <p className="article-detail-content">
          {this.props.t('noBodyCopyValue')}
        </p>
      );

    return (
      <div className="container">
        <Metadata
          title={article.elements.metadataMetaTitle}
          description={article.elements.metadataMetaDescription}
          ogTitle={article.elements.metadataOgTitle}
          ogImage={article.elements.metadataOgImage}
          ogDescription={article.elements.metadataOgDescription}
          twitterTitle={article.elements.metadataMetaTitle}
          twitterSite={article.elements.metadataTwitterSite}
          twitterCreator={article.elements.metadataTwitterCreator}
          twitterDescription={article.elements.metadataTwitterDescription}
          twitterImage={article.elements.metadataTwitterImage}
        />
        <article className="article-detail col-lg-9 col-md-12 article-detail-related-box">
          <h2>{title}</h2>
          <div className="article-detail-datetime">{postDate}</div>
          <div className="row">
            <div className="article-detail-image col-md-push-2 col-md-8">
              {imageLink}
            </div>
          </div>
          <div className="row">{bodyCopyElement}</div>
        </article>
      </div>
    );
  }
}

export default translate('Articles')(Article);
