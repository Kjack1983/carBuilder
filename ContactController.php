<?php

class ContactController extends Zend_Controller_Action {

	//public $Car;

	public function init() {
		Zend_Layout::getMvcInstance() -> setLayout('tools');
	}
	
	public function indexAction() {
			
	}
	
	public function thanksAction() {
			
	  if ($this -> _request -> isPost()) {
				
			$title = $this->getRequest()->getPost("title");
			
			$firstname = htmlspecialchars($this->getRequest()->getPost("firstname"));
			
			$lastname = htmlspecialchars($this->getRequest()->getPost("lastname"));
			
			$email = htmlspecialchars($this->getRequest()->getPost("email"));
			
			$comment = htmlspecialchars($this->getRequest()->getPost("comment"));
			
			$phone = htmlspecialchars($this->getRequest()->getPost("phone"));
			
			$mobile = htmlspecialchars($this->getRequest()->getPost("mobile"));
			
			$confirmmarketingemailsms = htmlspecialchars($this->getRequest()->getPost("confirm-marketing-email-sms"));
			
			$confirmmarketingphonecall = htmlspecialchars($this->getRequest()->getPost("confirm-marketing-phonecall"));
			
			$file = fopen(DATA_PATH.'/contact/'. $firstname.'_'.time().'_formdata.csv', 'w');
			
			$data[] = array($firstname, $lastname, $email, $comment, $phone, $mobile, $confirmmarketingemailsms, $confirmmarketingphonecall);
			
			//open and write csv
			foreach ($data as $row) {
				fputcsv($file, $row);
			}
			//close file created with timestamp
			fclose($file);
			
			//merge csvs to one csv file
			$nn = 0;
		    foreach (glob(DATA_PATH.'/contact/'."*formdata.csv") as $filename) {
				//print_r($filename);	
		        if (($handle = fopen($filename, "r")) !== FALSE) {
		
		            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
		                $c = count($data);
		                $csvarray[$nn][] = $filename;
		                for ($x=0;$x<$c;$x++)
		                {
		                    $csvarray[$nn][] = $data[$x];
		                }
		                $nn++;
		            }
		
		            fclose($handle);
		        }
		    }
		
		    $fp = fopen(DATA_PATH.'/contact/'.'file.csv', 'w');//output file set here
		
		    foreach ($csvarray as $fields) {
		        fputcsv($fp, $fields);
		    }
			//close file.csv
		    fclose($fp);
			
			/*
			$email_to = "gmartakis@gmail.gr";
			$email_subject = "Επικοινωνία";
			 
			$headers = 'From: '.$email."\r\n". 'Reply-To: '.$email."\r\n" .'X-Mailer: PHP/' . phpversion();
			
			$email_message = "Λεπτομέρειες επικοινωνίας.\n\n";
 
		 	$email_message .= "Τίτλος: ".$title."\n";
			
		    $email_message .= "Όνομα: ".$firstname."\n";
		 
		    $email_message .= "Επώνυμο: ".$lastname."\n";
		 
		    $email_message .= "Email: ".$email."\n";
		 
		    $email_message .= "Κινητό: ".$mobile."\n";
		 	
			$email_message .= "Τηλέφωνο: ".$phone."\n";
		 
		    $email_message .= "Σχόλια: ".$comments."\n";
		 
		 	$email_message .= "Επικοινωνία τηλέφωνο: ".$confirmmarketingphonecall."\n";
			
			$email_message .= "Επικοινωνία email-sms: ".$confirmmarketingemailsms."\n";
			
			//$email_to
			mail('gmartakis@gmail.gr', $email_subject, $email_message, $headers);  //doesn't send mail to Lotus Notes TODO
		
			if ( function_exists( 'mail' ) )
			{
			   //echo 'mail() is available';
			}
			else
			{
			   //echo 'mail() has been disabled';
			} 
			*/		
			//echo html_entity_decode('&Pi;&alpha;&rho;&alpha;&kappa;&alpha;&lambda;ώ &gamma;&iota;&alpha; &tau;&eta;&nu; &alpha;&pi;&omicron;&sigma;&tau;&omicron;&lambda;ή &tau;&omicron;&upsilon; newsletter &sigma;&tau;&omicron; &sigma;&upsilon;&gamma;&kappa;&epsilon;&kappa;&rho;&iota;&mu;έ&nu;&omicron;');
			
		}else
		{
			throw new Zend_Controller_Action_Exception(null, 404);
		}
	}
	
	private function proccessData() {}

}
