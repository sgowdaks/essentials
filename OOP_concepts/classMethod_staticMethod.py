class Employees:
    
    raise_amt = 1.5
    
    def __init__(self, first, last, email):
        self.first = first
        self.last = last
        self.email = email
        
    def fullname(self):
        return self.first + self.last
    
    #the class method takes the Employees class and create an object
    @classmethod
    def its_classmethod(cls, name_):
        first, last, email = name_.split("_")
        return cls(first, last, email)
    
    
    #static method does not receive any feilds related to class 
    @staticmethod
    def its_staticmethod(pay):
      return pay
    
        
        
        
name_ = "john_Deo_19900"
emp2 = Employees.its_classmethod(name_)
print(emp2.first)   #john
print(emp2.last)   #Deo
