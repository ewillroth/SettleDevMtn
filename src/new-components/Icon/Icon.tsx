import React from 'react'

const Icon = ({iconName, id}) => {
	switch(iconName){
		case 'removeCircle':
			return (
				<svg id={id} width="24" height="24" viewBox="0 0 24 24">
					<path d="M0,0H24V24H0Z" fill="none"/>
					<path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H8a1,1,0,1,1,0-2h8a1,1,0,1,1,0,2Z" fill="#ee6352"/>
				</svg>
			)
		case 'copy':
			return (
				<svg id={id} width="24" height="24" viewBox="0 0 24 24">
					<path d="M0,0H24V24H0Z" fill="none"/>
					<path d="M15,1H4A2.006,2.006,0,0,0,2,3V16a1,1,0,1,0,2,0V4A1,1,0,0,1,5,3H15a1,1,0,0,0,0-2Zm4,4H8A2.006,2.006,0,0,0,6,7V21a2.006,2.006,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V7A2.006,2.006,0,0,0,19,5ZM18,21H9a1,1,0,0,1-1-1V8A1,1,0,0,1,9,7h9a1,1,0,0,1,1,1V20A1,1,0,0,1,18,21Z" transform="translate(0 0)" fill="#60b5ff"/>
				</svg>
			)
	}
}

export default Icon;