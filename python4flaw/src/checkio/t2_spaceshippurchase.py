def checkio(offers):
    '''
       the amount of money that Petr will pay for the ride
    '''
    initial_petr, raise_petr, initial_driver, reduction_driver = offers
#    while initial_petr < initial_driver:
#        initial_petr += raise_petr
#        initial_driver -= reduction_driver
    import math
    step = math.ceil((initial_driver - initial_petr) * 1.0 / (raise_petr + reduction_driver))
    return initial_petr + step * raise_petr

if __name__ == '__main__':
    assert checkio([150, 50, 1000, 100]) == 450, 'First'
    assert checkio([150, 50, 900, 100]) == 400, 'Second'
    print 'All is ok'
    
