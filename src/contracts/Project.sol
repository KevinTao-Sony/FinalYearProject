pragma solidity ^0.5.0;

contract Project {
	string public name;
	uint public postCount = 0;
	uint public docCount = 0;

	//writting key value pair into the blockchain
	mapping(uint => Post) public posts;
	mapping(uint => Doc) public docs;

	struct Post {
		uint id;
		string content;
		address author;
	}	

	struct Doc {
		uint id;
		string title;
		string content;
		address author;
	}
	
	event PostCreated(
		uint id,
		string content,
		address author
	);

	event DocCreated(
		uint doc_id,
		string title,
		string content,
		address author
	);

	constructor() public  {
		name="project";
	}

	function uploadDoc(string memory _IPFShash, string memory _title) public {
		//upload documents to IPFS get hash then save hash on to blockchain
		docCount++;

		//make a doc
		docs[docCount] = Doc(docCount, _title, _IPFShash, msg.sender);

		//Trigger Event, solidty provides a way for users to track events 
		emit DocCreated(docCount, _title, _IPFShash, msg.sender);
	}	

	function createPost(string memory _content) public {
		//require valid content solidity specific function, if 1 then run rest of code, 
		//else stops and refund gas

		require(bytes(_content).length > 0 );

		postCount++;
		//make a post
		posts[postCount] = Post(postCount, _content, msg.sender);
		
		//Trigger Event, solidty provides a way for users to track events 
		emit PostCreated(postCount, _content, msg.sender);
	}

	function updateDoc(uint _id, string memory _IPFShash, string memory _title) public {

		//make a doc
		docs[_id] = Doc(docCount, _title, _IPFShash, msg.sender);

		//Trigger Event, solidty provides a way for users to track events 
		
	}
	

}