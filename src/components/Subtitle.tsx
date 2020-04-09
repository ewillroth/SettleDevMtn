import React from "react";
import styled from "styled-components";

const H2 = styled.h2`
	font-family: Roboto;
	font-size: 20px;
	color: #040f0f;
	text-align: center;
	margin: 0 10%;
`;

const Subtitle = () => {
	return (
		<H2>
			A tool to help groups make decisions. Each person writes down three unique
			suggestions, suggestions are crossed off one at a time, and the last
			suggestion remaining is the winner.
		</H2>
	);
};

export default Subtitle;
