import { Link } from 'react-router-dom';

const ListItem = ({ id, imgUrl, name}) => {
  return (
    <Link 
      to="game"
      state={{ id: id }}
      className="item-container"
    >
      {/* only offers one image size, 640x640, as of 10/2/22 */}
      <img className="item-icon" src={imgUrl} alt={`Playlist icon for ${name}`} />
      <p className="item-info">{name}</p>
    </Link>
  )
}

export default ListItem
