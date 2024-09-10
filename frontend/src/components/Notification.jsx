import PropTypes from 'prop-types';

const Notification = ({ type = "info", content = '' }) => {
    if (type === '' || content === '') {
        return null;
    }
    return <div className={type} style={{margin: "0.4rem 0"}}>{content}</div>;
};

Notification.propTypes = {
    type: PropTypes.string,
    content: PropTypes.string,
};

export default Notification;