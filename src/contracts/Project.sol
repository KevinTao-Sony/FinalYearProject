pragma solidity ^0.5.0;

contract Project {
	string public name;
	uint public postCount = 0;
	uint public docCount = 0;

	//writting key value pair into the blockchain
	mapping(uint => Post) public posts;
	//mapping(uint => Doc) public Docs;
	
	Doc[] public document;

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

	event DocUploaded(
		uint doc_id,
		string title,
		string content,
		address author
	);

	event DocDeleted(
		uint doc_id

	);


	constructor() public  {
		name="project";
	}

	function uploadDoc(string memory _IPFShash, string memory _title) public {
		//upload documents to IPFS get hash then save hash on to blockchain
		
		//make a doc
		//Docs[docCount] = Doc(docCount, _title, _IPFShash, msg.sender);
		document.push(Doc(docCount, _title, _IPFShash, msg.sender));
		docCount++;
		//Trigger Event, solidty provides a way for users to track events and test
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

		for (uint i=0; i<document.length; i++) {
			if (document[i].id == _id){
				document[i].content =  _IPFShash;
				document[i].author =  msg.sender;
			}
		}
		//Trigger Event, solidty provides a way for users to track events 
		emit DocUploaded(_id,  _title, _IPFShash, msg.sender);
	
	}

	function deleteDoc(uint _id) public {

		for (uint i=0; i<document.length; i++) {
			if (document[i].id == _id){
				delete document[i];
				docCount--;
			}
		}	
		emit DocDeleted(_id);
	}


	  
}