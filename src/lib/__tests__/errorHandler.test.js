import { describe, it, expect, vi } from 'vitest';
import { handleAsyncError, withErrorHandling } from '../errorHandler';

describe('errorHandler', () => {
    describe('handleAsyncError', () => {
        it('should log error with context', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Test error');
            
            handleAsyncError(error, 'testContext');
            
            expect(consoleSpy).toHaveBeenCalledWith('[testContext]', error);
            consoleSpy.mockRestore();
        });
        
        it('should call revert function if provided', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const revert = vi.fn();
            const error = new Error('Test error');
            
            handleAsyncError(error, 'testContext', { revert });
            
            expect(revert).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
        
        it('should call onError callback if provided', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const onError = vi.fn();
            const error = new Error('Test error');
            
            handleAsyncError(error, 'testContext', { onError });
            
            expect(onError).toHaveBeenCalledWith(error);
            consoleSpy.mockRestore();
        });
        
        it('should return custom message if provided', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Test error');
            const customMessage = 'Custom error message';
            
            const result = handleAsyncError(error, 'testContext', { 
                message: customMessage 
            });
            
            expect(result).toBe(customMessage);
            consoleSpy.mockRestore();
        });
        
        it('should return default message if not provided', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Test error');
            
            const result = handleAsyncError(error, 'testContext');
            
            expect(result).toBe('An error occurred. Please try again.');
            consoleSpy.mockRestore();
        });
    });
    
    describe('withErrorHandling', () => {
        it('should return result on success', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const successFn = async () => 'success';
            
            const result = await withErrorHandling(successFn, 'testContext');
            
            expect(result).toBe('success');
            consoleSpy.mockRestore();
        });
        
        it('should throw error by default', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const errorFn = async () => {
                throw new Error('Test error');
            };
            
            await expect(withErrorHandling(errorFn, 'testContext')).rejects.toThrow('Test error');
            consoleSpy.mockRestore();
        });
        
        it('should return error object when throwError is false', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const errorFn = async () => {
                throw new Error('Test error');
            };
            
            const result = await withErrorHandling(errorFn, 'testContext', { 
                throwError: false 
            });
            
            expect(result).toHaveProperty('error');
            expect(result.error).toBe('An error occurred. Please try again.');
            consoleSpy.mockRestore();
        });
        
        it('should use custom message in error response', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const errorFn = async () => {
                throw new Error('Test error');
            };
            const customMessage = 'Custom failure message';
            
            const result = await withErrorHandling(errorFn, 'testContext', { 
                throwError: false,
                message: customMessage
            });
            
            expect(result.error).toBe(customMessage);
            consoleSpy.mockRestore();
        });
    });
});
