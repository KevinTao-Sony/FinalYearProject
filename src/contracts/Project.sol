pragma solidity ^0.5.0;

contract Project {
	string public name;
	uint public postCount = 0;
	
	//writting key value pair into the blockchain
	mapping(uint => Post) public posts;


	struct Post {
		uint id;
		string title;
		string content;
		address author;
	}
	
	event PostCreated(
	uint id,
	string title,
	string content,
	address author
	);


	constructor() public  {
		name="project";
	}

	function createPost(string memory _content, string memory _title) public {
		//require valid content solidity specific function, if 1 then run rest of code, 
		//else stops and refund gas

		require(bytes(_content).length > 0 );

		postCount++;
		//make a post
		posts[postCount] = Post(postCount, _title, _content, msg.sender);
		
		//Trigger Event, solidty provides a way for users to track events 
		emit PostCreated(postCount, _title, _content, msg.sender);

	}
}